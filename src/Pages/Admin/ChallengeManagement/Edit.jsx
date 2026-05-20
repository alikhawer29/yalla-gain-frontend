import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import ImageDropzone from "../../../Components/ImageDropzone";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import MultiSelect from "../../../Components/MultiSelect";
import { Select } from "../../../Components/Select";
import { challengeKinds, generalStatus } from "../../../Config/TableStatus";
import { challengeEditSchema } from "../../../Config/Validations";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getDetails, post } from "../../../Services/Api";
import {
  bodyPartOptions,
  challengeTypeBodyParts,
  mapApiBodyPartsToForm,
  parseChallengeTimeFromApi,
  timeHourSelectOptions,
  timeMinuteSelectOptions,
} from "./challengeConstants";
import "./style.css";

const emptyValues = {
  title: "",
  type: "",
  duration: 1,
  time_hour: "",
  time_minute: "",
  milestone: "",
  reward: 1,
  description: "",
  image: "",
  status: "",
  body_parts: [],
};

const EditChallenge = ({ showModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [challengeMeta, setChallengeMeta] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getDetails(`/challenge/${id}`);
      if (res?.status) {
        const d = res?.data || {};
        const statusVal = d.status;
        const statusStr =
          statusVal === 0 || statusVal === 1
            ? String(statusVal)
            : statusVal === "0" || statusVal === "1"
              ? statusVal
              : "";

        setChallengeMeta({
          id: d.id,
          challenge_status: d.challenge_status,
          challenge_progress: d.challenge_progress,
          is_started: d.is_started,
          execution_time: d.execution_time,
          created_at: d.created_at,
        });

        setInitialValues({
          title: d.title || "",
          type: d.type || "",
          image: d.image || "",
          description: d.description || "",
          duration: Number.isInteger(Number(d.duration))
            ? Number(d.duration)
            : Math.trunc(Number(d.duration)) || 1,
          ...parseChallengeTimeFromApi(d),
          milestone: d.milestone || "",
          reward: Number(d.reward) || 1,
          status: statusStr,
          body_parts: mapApiBodyPartsToForm(d.body_parts),
        });
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (values) => {
    startSubmitting();
    const h = Number(values.time_hour);
    const m = Number(values.time_minute);
    const payload = {
      title: values.title,
      type: values.type,
      duration: parseInt(String(values.duration), 10),
      time_hour: h,
      time_minute: m,
      execution_time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      milestone: values.milestone,
      reward: Number(values.reward),
      description: values.description,
      status: values.status,
      body_parts: (values.body_parts || []).map((bp) => ({
        text: bp.text,
        value: bp.value,
        percentage:
          bp.percentage != null && bp.percentage !== ""
            ? String(bp.percentage)
            : "",
      })),
    };
    if (
      typeof values.image === "string" ||
      values.image === null ||
      values.image === undefined
    ) {
      /* keep existing image on server */
    } else if (values.image instanceof File) {
      payload.image = values.image;
    }
    const res = await post(`/challenge/${id}/update`, payload);
    if (res?.status) {
      showModal(
        "Successfully",
        "Challenge has been updated successfully",
        () => navigate("/admin/challenges"),
        true,
      );
    } else {
      showModal("Error", res?.message ?? "Something went wrong", null, true);
    }
    stopSubmitting();
  };

  return (
    <DashboardLayout pageTitle={t('sidebar.challenge_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-5">
                <BackButton2 />
                Edit Challenge
              </h2>

              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={challengeEditSchema}
                validateOnBlur
                validateOnChange
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
                }) => (
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Challenge Title"
                        placeholder="Enter Challenge Title"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.title && errors.title}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <Select
                        label="Status"
                        name="status"
                        value={values.status}
                        onChange={(v) => setFieldValue("status", v)}
                        onBlur={handleBlur}
                        error={touched.status && errors.status}
                        required
                      >
                        {generalStatus}
                      </Select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <Select
                        label="Type Of Challenge"
                        name="type"
                        required
                        value={values.type}
                        onChange={(v) => {
                          setFieldValue("type", v);
                          setFieldValue("body_parts", []);
                        }}
                        onBlur={handleBlur}
                        error={touched.type && errors.type}
                      >
                        {challengeKinds}
                      </Select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Add Milestone To Be Achieved"
                        placeholder="Write Milestone To Be Achieved In This Challenge"
                        name="milestone"
                        value={values.milestone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.milestone && errors.milestone}
                        required
                      />
                    </div>

                    <div className="col-md-2 mb-4">
                      <CustomInput
                        label="Duration (Days)"
                        placeholder="Enter Duration"
                        name="duration"
                        value={values.duration}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            setFieldValue("duration", "");
                            return;
                          }
                          const beforeDecimal = String(raw).split(/[.,]/)[0];
                          const digits = beforeDecimal.replace(/\D/g, "");
                          if (digits === "") {
                            setFieldValue("duration", "");
                            return;
                          }
                          setFieldValue("duration", parseInt(digits, 10));
                        }}
                        onBlur={handleBlur}
                        error={touched.duration && errors.duration}
                        required
                        type="number"
                        min="0"
                        step="1"
                      />
                    </div>

                    <div className="col-md-4 mb-4">
                      <label className="form-label">
                        Time (Per Day)
                        <span className="text-danger">*</span>
                      </label>
                      <div className="row g-2">
                        <div className="col-6">
                          <Select
                            name="time_hour"
                            value={values.time_hour}
                            onChange={(v) => setFieldValue("time_hour", v)}
                            onBlur={handleBlur}
                            error={touched.time_hour && errors.time_hour}
                            required
                          >
                            {timeHourSelectOptions}
                          </Select>
                        </div>
                        <div className="col-6">
                          <Select
                            name="time_minute"
                            value={values.time_minute}
                            onChange={(v) => setFieldValue("time_minute", v)}
                            onBlur={handleBlur}
                            error={touched.time_minute && errors.time_minute}
                            required
                          >
                            {timeMinuteSelectOptions}
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Reward"
                        placeholder="Enter Reward"
                        name="reward"
                        value={values.reward}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.reward && errors.reward}
                        required
                        type="number"
                        min="0"
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <ImageDropzone
                        label="Upload Image"
                        required={false}
                        initialUrl={
                          typeof values.image === "string" ? values.image : ""
                        }
                        onChange={(file) => setFieldValue("image", file)}
                      />
                      {touched.image && errors.image ? (
                        <div className="error-message red-text">
                          {errors.image}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Description"
                        placeholder="Enter Description"
                        name="description"
                        type="textarea"
                        rows={7}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.description && errors.description}
                        required
                      />
                    </div>

                    <div className="col-6 mb-4">
                      <MultiSelect
                        label="Body Part"
                        name="body_parts"
                        options={
                          values.type
                            ? bodyPartOptions.filter((option) =>
                                challengeTypeBodyParts[values.type]?.includes(
                                  option.value,
                                ),
                              )
                            : bodyPartOptions
                        }
                        value={values.body_parts}
                        onChange={(v) => setFieldValue("body_parts", v)}
                        error={touched.body_parts && errors.body_parts}
                        placeholder="Select"
                        required
                      />
                    </div>

                    <div className="col-8">
                      <div className="row">
                        {values.body_parts.map((item, index) => (
                          <div className="col-6 mb-4" key={item.value}>
                            <CustomInput
                              width={"50%"}
                              label={item.text}
                              placeholder="Enter Percentage"
                              name={`body_parts[${index}].percentage`}
                              value={item.percentage}
                              onChange={(e) => {
                                const value = e.target.value;
                                const numValue = parseFloat(value);
                                if (
                                  value === "" ||
                                  (numValue >= -100 && numValue <= 100)
                                ) {
                                  const newBodyParts = [...values.body_parts];
                                  newBodyParts[index].percentage = value;
                                  setFieldValue("body_parts", newBodyParts);
                                }
                              }}
                              onBlur={handleBlur}
                              required
                              type="number"
                              rightText="%"
                              rightTextClass="light-text"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <CustomButton
                        type="submit"
                        variant="primary"
                        text="Update"
                        isPending={isSubmitting}
                        className="add-btn"
                      />
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(EditChallenge);
