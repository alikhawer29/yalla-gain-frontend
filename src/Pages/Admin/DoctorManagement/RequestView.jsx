import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import { deleteRequest, getDetails, post, postJson } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { images } from "../../../Assets";
import { getCountryFlag } from "../../../Utils/helper";
import "./style.css";
import DoctorReapproveForm from "./DoctorReapproveForm";

const requestProfileSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const formatNameField = (field) => {
  if (!field) return "-";
  const value = typeof field === "string" ? field : field.name || "";
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatLanguageField = (field) => {
  if (!field) return "-";

  const rawValue = typeof field === "string" ? field : field?.name || "";
  if (!rawValue) return "-";

  return (
    rawValue
      .split(",")
      .map((part) =>
        part
          .trim()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      )
      .filter(Boolean)
      .join(", ") || "-"
  );
};

const getStatusMap = (t) => ({
  1: t("request_status.approved"),
  2: t("request_status.pending"),
  3: t("request_status.rejected"),
});

const DoctorRequestView = ({ showModal, reasonModal }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [doctor, setDoctor] = useState(null);
  const [requestProfileLoading, setRequestProfileLoading] = useState(true);
  const [reapproveEditMode, setReapproveEditMode] = useState(false);
  const [editLockSecret, setEditLockSecret] = useState(null);

  const fetchDoctor = async () => {
    setRequestProfileLoading(true);
    try {
      const response = await getDetails(`/doctor/${id}`);
      if (response?.status) {
        setDoctor(response.data || null);
      } else {
        setDoctor(null);
      }
    } catch (error) {
      console.error("Error fetching doctor request details:", error);
      setDoctor(null);
    } finally {
      setRequestProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (doctor && doctor.status !== 3) {
      setReapproveEditMode(false);
      setEditLockSecret(null);
    }
  }, [doctor?.status]);

  const statusLabel = useMemo(
    () => getStatusMap(t)[doctor?.status] || t("request_status.pending"),
    [doctor, t],
  );
  const statusClassKey = { 1: "Approved", 2: "Pending", 3: "Rejected" }[doctor?.status] || "Pending";
  const statusClassName = `status${statusClassKey}`;

  const details = useMemo(() => {
    if (!doctor) {
      return {
        name: "-",
        gender: "-",
        phone: "-",
        phoneValue: "-",
        countryCode: "",
        email: "-",
        state: "-",
        city: "-",
        bio: "-",
        language: "-",
        rejection_reason: null,
        reapprove_reason: null,
        experienceList: [],
        certifications: [
          {
            id: "placeholder",
            institute_name: "-",
            certificate_title: "-",
            certificate_picture: images.certificate_image,
          },
        ],
        photo: images.placeholder,
      };
    }

    const phoneValue =
      `${doctor.dialing_code ? `${doctor.dialing_code} ` : ""}${doctor.phone || "-"}`.trim();

    const experienceList = Array.isArray(doctor.experience)
      ? doctor.experience.map((item) => ({
          id: item.id,
          specialization: item.specialization || "-",
          experience: item.experience || "-",
        }))
      : [];

    const certifications =
      Array.isArray(doctor.certifications) && doctor.certifications.length
        ? doctor.certifications.map((cert) => ({
            id: cert.id,
            institute_name: cert.institute_name || "-",
            certificate_title: cert.certificate_title || "-",
            certificate_picture:
              cert.certificate_picture || images.certificate_image,
          }))
        : [
            {
              id: "placeholder",
              institute_name: "-",
              certificate_title: "-",
              certificate_picture: images.certificate_image,
            },
          ];

    return {
      name:
        [doctor.first_name, doctor.last_name].filter(Boolean).join(" ") || "-",
      gender: formatNameField(doctor.gender),
      phone: phoneValue || "-",
      phoneValue,
      countryCode: doctor.country_code || "",
      email: doctor.email || "-",
      state: formatNameField(doctor.state),
      city: formatNameField(doctor.city),
      bio: doctor.bio || "-",
      language: formatLanguageField(doctor.language),
      experienceList,
      rejection_reason: doctor.rejection_reason || null,
      reapprove_reason: doctor.reapprove_reason || null,
      certifications,
      photo: doctor.photo || images.placeholder,
    };
  }, [doctor]);

  const confirmApprove = async () => {
    try {
      startSubmitting(true);
      await post(`/doctor/${id}/status/request`, { status: "approved" });
      await fetchDoctor();
      showModal(
        "Successfully",
        "Doctor has been approved successfully.",
        null,
        true,
      );
    } catch (error) {
      console.error("Error approving doctor:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  const confirmReject = async (reason) => {
    try {
      startSubmitting(true);
      await post(`/doctor/${id}/status/request`, {
        status: "rejected",
        rejection_reason: reason,
      });
      await fetchDoctor();
      reasonModal(
        "Successfully",
        "Doctor has been rejected successfully.",
        null,
        true,
      );
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  const handleApprove = () => {
    showModal(
      "Approve",
      "Are you sure you want to approve this doctor?",
      confirmApprove,
    );
  };

  const releaseEditLock = useCallback(async () => {
    try {
      await deleteRequest(`/doctor/${id}/edit-lock`);
    } catch (e) {
      console.error("Release edit lock:", e);
    } finally {
      setEditLockSecret(null);
    }
  }, [id]);

  const handleReApproveClick = async () => {
    startSubmitting(true);
    try {
      const res = await postJson(`/doctor/${id}/edit-lock`, {});
      const acquired = res?.status === true && res?.locked === true;
      if (acquired) {
        setEditLockSecret(
          typeof res?.lock_secret === "string" ? res.lock_secret : null,
        );
        setReapproveEditMode(true);
        return;
      }
      const fallback =
        "This profile is currently being edited in another browser or device. Please try again later.";
      const message =
        typeof res?.message === "string" && res.message.trim()
          ? res.message.trim()
          : fallback;
      showModal("Cannot edit", message, null, false, true);
    } catch (error) {
      console.error("Edit lock:", error);
      showModal(
        "Error",
        "Could not start editing. Please try again.",
        null,
        false,
        true,
      );
    } finally {
      stopSubmitting(false);
    }
  };

  const handleReject = () => {
    reasonModal(
      "",
      "",
      confirmReject,
      false,
      true,
      "",
      "",
      "Rejected Reason :",
      "Write Rejected Reason......",
      true,
    );
  };

  const showReapproveForm =
    doctor?.status === 3 && reapproveEditMode && doctor;

  const infoItems = useMemo(
    () => [
      { key: "user_name", label: t("fields.user_name"), value: details.name },
      { key: "gender", label: t("fields.gender"), value: details.gender },
      { key: "phone", label: t("fields.phone_number"), value: details.phoneValue },
      { key: "email", label: t("fields.email_address"), value: details.email },
      { key: "state", label: t("fields.state"), value: details.state },
      { key: "city", label: t("fields.city"), value: details.city },
      { key: "bio", label: t("fields.bio"), value: details.bio },
      { key: "language", label: t("fields.language"), value: details.language },
      {
        key: "experience",
        label: t("fields.specialization_experience"),
        value: details.experienceList,
      },
    ],
    [details, t],
  );

  const renderInfoValue = (item) => {
    const { key, value } = item;
    if (key === "experience") {
      if (!Array.isArray(value) || !value.length) return "-";
      return value.map((exp) => (
        <div key={exp.id}>
          {exp.specialization} ({exp.experience} {t("common.years")})
        </div>
      ));
    }
    if (key === "phone" && typeof value === "string") {
      return (
        <>
          {getCountryFlag(value, details.countryCode)}
          {value}
        </>
      );
    }
    return value ?? "-";
  };

  return (
    <DashboardLayout pageTitle={t('pages.doctor_request_details')}>
      <div className="container-fluid">
        <div className="dashCard doctor-request-view">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <h2 className="mainTitle mb-4">
              <BackButton2 />
              {t("pages.doctor_details")}
            </h2>
            {requestProfileLoading ? (
              <Skeleton
                width={110}
                height={32}
                borderRadius={999}
                {...requestProfileSkeletonProps}
              />
            ) : (
              <span className={`statusChip ${statusClassName}`}>
                {statusLabel}
              </span>
            )}
          </div>

          {requestProfileLoading ? (
            <>
              <div className="doctor-request-summary">
                <div className="d-flex align-items-center gap-5 mb-4 flex-wrap">
                  <Skeleton
                    circle
                    width={120}
                    height={120}
                    {...requestProfileSkeletonProps}
                  />
                </div>
                <div className="doctor-request-actions d-flex flex-wrap gap-2">
                  <Skeleton
                    width={120}
                    height={42}
                    borderRadius={8}
                    {...requestProfileSkeletonProps}
                  />
                  <Skeleton
                    width={120}
                    height={42}
                    borderRadius={8}
                    {...requestProfileSkeletonProps}
                  />
                </div>
              </div>
              <div className="doctor-info-grid">
                <div className="row">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      className="col-xl-3 col-md-6 mb-3"
                      key={`sk-info-${i}`}
                    >
                      <div className="detail-box">
                        <Skeleton
                          width="55%"
                          height={16}
                          {...requestProfileSkeletonProps}
                          className="mb-2"
                        />
                        <Skeleton
                          width="90%"
                          height={22}
                          {...requestProfileSkeletonProps}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="doctor-certification mt-5 detail-box">
                <Skeleton
                  width={220}
                  height={28}
                  {...requestProfileSkeletonProps}
                  className="mb-3"
                />
                <div className="row g-4 align-items-center">
                  <div className="col-xl-5">
                    <div className="detail-box mb-3">
                      <Skeleton
                        width="50%"
                        height={16}
                        {...requestProfileSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="85%"
                        height={20}
                        {...requestProfileSkeletonProps}
                      />
                    </div>
                    <div className="detail-box">
                      <Skeleton
                        width="45%"
                        height={16}
                        {...requestProfileSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="75%"
                        height={20}
                        {...requestProfileSkeletonProps}
                      />
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="certificate-preview doctor-certificate-preview">
                      <Skeleton height={280} {...requestProfileSkeletonProps} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {!showReapproveForm && (
                <div className="doctor-request-summary">
                  <div className="d-flex align-items-center gap-5 mb-4">
                    <div className="detail-box-img">
                      <img src={details.photo} alt={details.name} />
                    </div>
                  </div>

                  {doctor?.status === 2 && (
                    <div className="doctor-request-actions">
                      <button
                        className="btn btn-primary"
                        onClick={handleApprove}
                        disabled={isSubmitting || doctor?.status === 1}
                      >
                        {t("pages.approve")}
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleReject}
                        disabled={isSubmitting || doctor?.status === 3}
                      >
                        {t("pages.reject")}
                      </button>
                    </div>
                  )}

                  {doctor?.status === 3 && !reapproveEditMode && (
                    <div className="doctor-request-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleReApproveClick}
                        disabled={isSubmitting}
                      >
                        {t("pages.reapprove")}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {details?.rejection_reason &&
                doctor?.status === 3 &&
                !reapproveEditMode && (
                  <div className="doctor-info-grid mb-4">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <div className="detail-box">
                          <h6>{t("pages.rejection_reason")}</h6>
                          <p className="mb-0">{details.rejection_reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {showReapproveForm && details?.rejection_reason && (
                <div className="doctor-info-grid mb-3">
                  <div className="row">
                    <div className="col-12">
                      <div className="detail-box">
                        <h6>{t("pages.rejection_reason")}</h6>
                        <p className="mb-0 ">{details.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showReapproveForm ? (
                <DoctorReapproveForm
                  doctor={doctor}
                  doctorId={id}
                  editLockSecret={editLockSecret}
                  readOnlyEmail={details.email}
                  onCancel={() => setReapproveEditMode(false)}
                  onReleaseEditLock={releaseEditLock}
                  onSuccess={fetchDoctor}
                  showModal={showModal}
                  isSubmitting={isSubmitting}
                  startSubmitting={startSubmitting}
                  stopSubmitting={stopSubmitting}
                />
              ) : (
                <>
                  <div className="doctor-info-grid">
                    <div className="row">
                      {infoItems.map((item) => (
                        <div className="col-xl-3 col-md-6 mb-3" key={item.key}>
                          <div className="detail-box">
                            <h6>{item.label}</h6>
                            <p className="mb-0">{renderInfoValue(item)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="doctor-certification mt-5 detail-box">
                    <h3 className="section-title mb-3">Certification Detail</h3>
                    {details.certifications.map((cert, index) => (
                      <div
                        className="row g-4 align-items-center"
                        key={cert.id || index}
                      >
                        <div className="col-xl-5">
                          <div className="detail-box mb-3">
                            <h6>Institute Name</h6>
                            <p className="mb-0">{cert.institute_name}</p>
                          </div>
                          <div className="detail-box">
                            <h6>Certificate Title</h6>
                            <p className="mb-0">{cert.certificate_title}</p>
                          </div>
                        </div>
                        <div className="col-xl-7">
                          <div className="certificate-preview doctor-certificate-preview">
                            <img
                              src={cert.certificate_picture}
                              alt="Certificate"
                              className="img-fluid doctor-certificate-image"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {details?.rejection_reason && statusLabel !== "Rejected" && (
                <div className="doctor-info-grid">
                  <div className="row">
                    <div
                      className="col-xl-3 col-md-6 mb-3"
                      key="Rejection Reason"
                    >
                      <div className="detail-box">
                        <h6>Rejection Reason</h6>
                        <p className="mb-0">{details?.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {details?.reapprove_reason && (
                <div className="doctor-info-grid mt-3">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="detail-box">
                        <h6>Re-approved Reason</h6>
                        <p className="mb-0">{details.reapprove_reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(DoctorRequestView);
