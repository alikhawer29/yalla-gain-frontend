import { FieldArray, Form, Formik } from "formik";
import { useMemo } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import AddIcon from "../../../Assets/images/svg/addIcon.svg?react";
import DeleteIcon from "../../../Assets/images/svg/deleteIcon.svg?react";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import ImageDropzone from "../../../Components/ImageDropzone";
import { Select } from "../../../Components/Select";
import { doctorReapproveProfileValidation } from "../../../Config/Validations";
import { genderOptions, language } from "../../../Config/TableStatus";
import { validateImage } from "../../../Utils/helper";
import {
  getCityOptionsForEmirate,
  getEmirateOptions,
  withLegacyOption,
} from "../../../Utils/uaeLocations";
import { post } from "../../../Services/Api";

const stringFromField = (field) => {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field.name || field.slug || "";
};

const genderValueFromDoctor = (doctor) => {
  const g = doctor?.gender;
  let raw = "male";
  if (!g) raw = "male";
  else if (typeof g === "string") raw = g.toLowerCase();
  else raw = (g.slug || g.name || "male").toString().toLowerCase();
  const matched = genderOptions.find(
    (o) => o.value === raw || o.text.toLowerCase() === raw,
  );
  return matched?.value || "male";
};

const languageValueFromDoctor = (doctor) => {
  const raw = doctor?.language;
  const str = stringFromField(raw).toLowerCase();
  if (!str) return "english";
  const byValue = language.find((l) => l.value && str.includes(l.value));
  if (byValue) return byValue.value;
  const first = str.split(",")[0]?.trim();
  const byText = language.find((l) => l.text && l.text.toLowerCase() === first);
  return byText?.value || "english";
};

const buildInitialValues = (doctor) => {
  const exp =
    Array.isArray(doctor.experience) && doctor.experience.length > 0
      ? doctor.experience.map((item) => ({
          specialization: item.specialization || "",
          experience: item.experience != null ? String(item.experience) : "",
        }))
      : [{ specialization: "", experience: "" }];

  const certs =
    Array.isArray(doctor.certifications) && doctor.certifications.length > 0
      ? doctor.certifications.map((c) => ({
          id: c.id,
          institute_name: c.institute_name || "",
          certificate_title: c.certificate_title || "",
          certificate_picture: null,
          existing_picture_url: c.certificate_picture || "",
        }))
      : [
          {
            id: null,
            institute_name: "",
            certificate_title: "",
            certificate_picture: null,
            existing_picture_url: "",
          },
        ];

  const phoneDisplay =
    doctor.dialing_code && doctor.phone
      ? `${doctor.dialing_code}${doctor.phone}`
      : doctor.phone || "";

  return {
    reapprove_reason: "",
    first_name: doctor.first_name || "",
    last_name: doctor.last_name || "",
    gender: genderValueFromDoctor(doctor),
    phone: phoneDisplay,
    state: stringFromField(doctor.state),
    city: stringFromField(doctor.city),
    bio: doctor.bio || "",
    language: languageValueFromDoctor(doctor),
    experience: exp,
    certificates: certs,
    deleteCertificatesIds: [],
    profile_photo: null,
  };
};

const DoctorReapproveForm = ({
  doctor,
  doctorId,
  editLockSecret,
  readOnlyEmail = "-",
  onCancel,
  onReleaseEditLock,
  onSuccess,
  showModal,
  isSubmitting,
  startSubmitting,
  stopSubmitting,
  successMessage = "Doctor profile has been re-approved successfully.",
}) => {
  const initialValues = useMemo(
    () => (doctor ? buildInitialValues(doctor) : null),
    [doctor],
  );

  const emirateOptions = useMemo(() => {
    const base = getEmirateOptions();
    const s = doctor ? stringFromField(doctor.state) : "";
    return withLegacyOption(base, s);
  }, [doctor]);

  if (!initialValues) return null;

  const handleSubmit = async (values) => {
    startSubmitting(true);
    try {
      let phone = doctor.phone ?? "";
      let dialing_code = doctor.dialing_code || "";
      let country_code = (doctor.country_code || "US").toUpperCase();

      const parsed = parsePhoneNumberFromString(values.phone);
      if (parsed) {
        dialing_code = `+${parsed.countryCallingCode}`;
        country_code = (parsed.country || country_code).toUpperCase();
        phone = String(parsed.nationalNumber ?? "");
      }

      const certificates = values.certificates.map((c) => {
        const row = {
          id: c.id != null && c.id !== "" ? c.id : null,
          institute_name: c.institute_name,
          certificate_title: c.certificate_title,
        };
        if (c.certificate_picture instanceof File) {
          row.certificate_picture = c.certificate_picture;
        }
        return row;
      });

      const payload = {
        reapprove_reason: values.reapprove_reason.trim(),
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        gender: values.gender,
        dialing_code,
        country_code,
        phone,
        state: values.state.trim(),
        city: values.city.trim(),
        bio: values.bio.trim(),
        language: values.language,
        experience: values.experience.map((e) => ({
          specialization: e.specialization.trim(),
          experience: e.experience.trim(),
        })),
        certificates,
      };

      if (values.deleteCertificatesIds?.length) {
        payload.deleteCertificatesIds = values.deleteCertificatesIds;
      }

      if (values.profile_photo instanceof File) {
        payload.photo = values.profile_photo;
      }

      if (typeof editLockSecret === "string" && editLockSecret.trim()) {
        payload.lock_secret = editLockSecret.trim();
      }

      const response = await post(
        `/doctor/${doctorId}/reapprove-profile`,
        payload,
      );

      if (response?.status) {
        if (onReleaseEditLock) await onReleaseEditLock();
        if (onSuccess) await onSuccess();
        showModal("Successfully", successMessage, null, true);
      }
    } catch (e) {
      console.error("Re-approve profile error:", e);
    } finally {
      stopSubmitting(false);
    }
  };

  const handleCancelClick = async () => {
    if (isSubmitting) return;
    if (onReleaseEditLock) await onReleaseEditLock();
    if (onCancel) onCancel();
  };

  return (
    <div className="doctor-reapprove-form">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={doctorReapproveProfileValidation}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldError,
          setFieldTouched,
          submitCount,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="doctor-request-summary">
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <ImageDropzone
                      label="Upload Image"
                      initialUrl={doctor?.photo || ""}
                      onChange={(file) => {
                        if (file) {
                          const err = validateImage(file);
                          if (err) {
                            setFieldError("profile_photo", err);
                            return;
                          }
                        }
                        setFieldError("profile_photo", "");
                        setFieldValue("profile_photo", file ?? "", true);
                        setFieldTouched("profile_photo", true, false);
                      }}
                    />
                    {(touched.profile_photo || submitCount > 0) &&
                    errors.profile_photo ? (
                      <div className="red-text small">
                        {errors.profile_photo}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="doctor-info-grid">
              <div className="row">
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>First name</h6>
                    <CustomInput
                      label=""
                      type="text"
                      required
                      id="first_name"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.first_name && errors.first_name
                          ? errors.first_name
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>Last name</h6>
                    <CustomInput
                      label=""
                      type="text"
                      required
                      id="last_name"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.last_name && errors.last_name
                          ? errors.last_name
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>Gender</h6>
                    <Select
                      id="gender"
                      name="gender"
                      value={values.gender}
                      onChange={(v) => setFieldValue("gender", v)}
                      onBlur={() => setFieldTouched("gender", true)}
                      mainLabel="Select gender"
                      isInputNeeded
                      className="form-select"
                    >
                      {genderOptions}
                    </Select>
                    {touched.gender && errors.gender && (
                      <div className="text-danger small mt-1">
                        {errors.gender}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>Phone number</h6>
                    <PhoneInput
                      international
                      defaultCountry="AE"
                      placeholder="Phone number"
                      value={values.phone}
                      onChange={(p) => setFieldValue("phone", p || "")}
                      onBlur={() => setFieldTouched("phone", true)}
                      className="form-control"
                    />
                    {touched.phone && errors.phone && (
                      <div className="text-danger small mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>Email address</h6>
                    <p className="mb-0">{readOnlyEmail}</p>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>State</h6>
                    <Select
                      id="state"
                      name="state"
                      value={values.state}
                      onChange={(v) => {
                        setFieldValue("state", v);
                        setFieldTouched("state", true);
                        const cities = getCityOptionsForEmirate(v, "");
                        if (!cities.some((c) => c.value === values.city)) {
                          setFieldValue("city", "");
                        }
                      }}
                      onBlur={() => setFieldTouched("state", true)}
                      mainLabel="Select emirate"
                      isInputNeeded
                      className="form-select"
                    >
                      {emirateOptions}
                    </Select>
                    {touched.state && errors.state && (
                      <div className="text-danger small mt-1">
                        {errors.state}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>City</h6>
                    <Select
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={(v) => {
                        setFieldValue("city", v);
                        setFieldTouched("city", true);
                      }}
                      onBlur={() => setFieldTouched("city", true)}
                      mainLabel={
                        values.state ? "Select city" : "Select emirate first"
                      }
                      isInputNeeded
                      className="form-select"
                    >
                      {getCityOptionsForEmirate(values.state, values.city)}
                    </Select>
                    {touched.city && errors.city && (
                      <div className="text-danger small mt-1">
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>Language</h6>
                    <Select
                      id="language"
                      name="language"
                      value={values.language}
                      onChange={(v) => setFieldValue("language", v)}
                      onBlur={() => setFieldTouched("language", true)}
                      mainLabel="Select language"
                      isInputNeeded
                      className="form-select"
                    >
                      {language.filter((l) => l.value)}
                    </Select>
                    {touched.language && errors.language && (
                      <div className="text-danger small mt-1">
                        {errors.language}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-12 col-md-6 mb-3">
                  <div className="detail-box">
                    <h6>Bio</h6>
                    <CustomInput
                      label=""
                      type="textarea"
                      required
                      id="bio"
                      name="bio"
                      rows={4}
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.bio && errors.bio ? errors.bio : null}
                    />
                  </div>
                </div>
                <div className="col-4 mb-3">
                  <div className="detail-box">
                    <h6>Specialization and experience</h6>
                    <FieldArray name="experience">
                      {({ push, remove }) => (
                        <>
                          {values.experience.map((_, index) => (
                            <div
                              className="mb-3 pb-2 border-bottom border-secondary border-opacity-10"
                              key={`exp-${index}`}
                            >
                              <CustomInput
                                label="Specialization"
                                labelclass="mainLabel small"
                                type="text"
                                required
                                id={`experience.${index}.specialization`}
                                name={`experience.${index}.specialization`}
                                value={values.experience[index].specialization}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.experience?.[index]?.specialization &&
                                  errors.experience?.[index]?.specialization
                                    ? errors.experience[index].specialization
                                    : null
                                }
                              />
                              <CustomInput
                                label="Years"
                                labelclass="mainLabel small"
                                type="text"
                                required
                                inputclass="mt-2"
                                id={`experience.${index}.experience`}
                                name={`experience.${index}.experience`}
                                value={values.experience[index].experience}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.experience?.[index]?.experience &&
                                  errors.experience?.[index]?.experience
                                    ? errors.experience[index].experience
                                    : null
                                }
                              />
                              <div className="d-flex gap-2 mt-2">
                                {values.experience.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => remove(index)}
                                    aria-label="Remove"
                                  >
                                    Remove
                                  </button>
                                )}
                                {index === values.experience.length - 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                      push({
                                        specialization: "",
                                        experience: "",
                                      })
                                    }
                                    aria-label="Add"
                                  >
                                    Add
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                    {typeof errors.experience === "string" && (
                      <div className="text-danger small">
                        {errors.experience}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="doctor-certification mt-5 detail-box">
              <h3 className="section-title mb-3">Certification Detail</h3>
              <FieldArray name="certificates">
                {({ push, remove }) => (
                  <>
                    {values.certificates.map((cert, index) => (
                      <div
                        className="row g-4 align-items-center mb-4 pb-4 border-bottom border-secondary border-opacity-10"
                        key={`cert-${index}`}
                      >
                        <div className="col-xl-5">
                          <div className="detail-box mb-3">
                            <h6>Institute Name</h6>
                            <CustomInput
                              label=""
                              type="text"
                              required
                              id={`certificates.${index}.institute_name`}
                              name={`certificates.${index}.institute_name`}
                              value={cert.institute_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.certificates?.[index]?.institute_name &&
                                errors.certificates?.[index]?.institute_name
                                  ? errors.certificates[index].institute_name
                                  : null
                              }
                            />
                          </div>
                          <div className="detail-box">
                            <h6>Certificate Title</h6>
                            <CustomInput
                              label=""
                              type="text"
                              required
                              id={`certificates.${index}.certificate_title`}
                              name={`certificates.${index}.certificate_title`}
                              value={cert.certificate_title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.certificates?.[index]
                                  ?.certificate_title &&
                                errors.certificates?.[index]?.certificate_title
                                  ? errors.certificates[index].certificate_title
                                  : null
                              }
                            />
                          </div>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {values.certificates.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  const removedId =
                                    values.certificates[index]?.id;
                                  if (removedId) {
                                    setFieldValue("deleteCertificatesIds", [
                                      ...values.deleteCertificatesIds,
                                      removedId,
                                    ]);
                                  }
                                  remove(index);
                                }}
                              >
                                Remove
                              </button>
                            )}
                            {index === values.certificates.length - 1 && (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                  push({
                                    id: null,
                                    institute_name: "",
                                    certificate_title: "",
                                    certificate_picture: null,
                                    existing_picture_url: "",
                                  })
                                }
                              >
                                Add certificate
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="col-xl-7">
                          <div className="detail-box">
                            <ImageDropzone
                              key={`cert-dz-${index}-${cert.id ?? "new"}`}
                              label="Upload Image"
                              required={!cert.id}
                              initialUrl={cert.existing_picture_url || ""}
                              onChange={(file) => {
                                if (file) {
                                  const err = validateImage(file);
                                  if (err) {
                                    setFieldError(
                                      `certificates.${index}.certificate_picture`,
                                      err,
                                    );
                                    return;
                                  }
                                }
                                setFieldError(
                                  `certificates.${index}.certificate_picture`,
                                  "",
                                );
                                setFieldValue(
                                  `certificates.${index}.certificate_picture`,
                                  file ?? null,
                                  true,
                                );
                                setFieldTouched(
                                  `certificates.${index}.certificate_picture`,
                                  true,
                                  false,
                                );
                                if (file) {
                                  setFieldValue(
                                    `certificates.${index}.existing_picture_url`,
                                    URL.createObjectURL(file),
                                    true,
                                  );
                                } else {
                                  setFieldValue(
                                    `certificates.${index}.existing_picture_url`,
                                    "",
                                    true,
                                  );
                                }
                              }}
                            />
                            {(touched.certificates?.[index]
                              ?.certificate_picture ||
                              submitCount > 0) &&
                              errors.certificates?.[index]
                                ?.certificate_picture && (
                                <div className="red-text small">
                                  {
                                    errors.certificates[index]
                                      .certificate_picture
                                  }
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>
            </div>

            <div className="doctor-info-grid mt-4">
              <div className="row">
                <div className="col-12 mb-3">
                  <div className="detail-box">
                    <h6>Re-approved reason</h6>
                    <CustomInput
                      label=""
                      type="textarea"
                      required
                      placeholder="Explain why this profile is being re-approved…"
                      id="reapprove_reason"
                      name="reapprove_reason"
                      rows={4}
                      value={values.reapprove_reason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.reapprove_reason && errors.reapprove_reason
                          ? errors.reapprove_reason
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="doctor-request-actions d-flex flex-nowrap align-items-center gap-2 mt-3">
              <CustomButton
                variant="btn btn-primary"
                text="Submit"
                pendingText="Submitting…"
                isPending={isSubmitting}
                type="submit"
              />
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelClick}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DoctorReapproveForm;
