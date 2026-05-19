import { useCallback, useEffect, useMemo, useState } from "react";
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
import DoctorReapproveForm from "../DoctorManagement/DoctorReapproveForm";
import "./style.css";

const STATUS_MAP = {
  1: "Approved",
  2: "Pending",
  3: "Rejected",
};

const formatNameField = (field) => {
  if (field == null || field === "") return "-";
  if (typeof field === "string") {
    const t = field.trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "-";
  }
  if (typeof field === "object") {
    const n = field.name ?? field.title ?? field.label;
    if (n != null && String(n).trim()) {
      const s = String(n).trim();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }
  return "-";
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

const requestProfileSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const TrainerRequestView = ({ showModal, reasonModal }) => {
  const { id } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [trainer, setTrainer] = useState(null);
  const [requestProfileLoading, setRequestProfileLoading] = useState(true);
  const [reapproveEditMode, setReapproveEditMode] = useState(false);
  const [editLockSecret, setEditLockSecret] = useState(null);

  const fetchTrainer = async () => {
    setRequestProfileLoading(true);
    try {
      const response = await getDetails(`/doctor/${id}`);
      if (response?.status) {
        setTrainer(response.data || null);
      } else {
        setTrainer(null);
      }
    } catch (error) {
      console.error("Error fetching trainer request details:", error);
      setTrainer(null);
    } finally {
      setRequestProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (trainer && STATUS_MAP[trainer.status] !== "Rejected") {
      setReapproveEditMode(false);
      setEditLockSecret(null);
    }
  }, [trainer?.status]);

  const statusLabel = useMemo(
    () => STATUS_MAP[trainer?.status] || "Pending",
    [trainer],
  );
  const statusClassName = `status${statusLabel}`;

  const details = useMemo(() => {
    if (!trainer) {
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
      `${trainer.dialing_code ? `${trainer.dialing_code} ` : ""}${trainer.phone || "-"}`.trim();

    const experienceList = Array.isArray(trainer.experience)
      ? trainer.experience.map((item) => ({
          id: item.id,
          specialization: item.specialization || "-",
          experience: item.experience || "-",
        }))
      : [];

    const certifications =
      Array.isArray(trainer.certifications) && trainer.certifications.length
        ? trainer.certifications.map((cert) => ({
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
        [trainer.first_name, trainer.last_name].filter(Boolean).join(" ") ||
        "-",
      gender: formatNameField(trainer.gender),
      phone: phoneValue || "-",
      phoneValue,
      countryCode: trainer.country_code || "",
      email: trainer.email || "-",
      state: formatNameField(trainer.state),
      city: formatNameField(trainer.city),
      bio: trainer.bio || "-",
      language: formatLanguageField(trainer.language),
      experienceList,
      rejection_reason: trainer.rejection_reason || null,
      reapprove_reason: trainer.reapprove_reason || null,
      certifications,
      photo: trainer.photo || images.placeholder,
    };
  }, [trainer]);

  const confirmApprove = async () => {
    try {
      startSubmitting(true);
      await post(`/doctor/${id}/status/request`, { status: "approved" });
      await fetchTrainer();
      showModal(
        "Successfully",
        "Trainer has been approved successfully.",
        null,
        true,
      );
    } catch (error) {
      console.error("Error approving trainer:", error);
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
      await fetchTrainer();
      reasonModal(
        "Successfully",
        "Trainer has been rejected successfully.",
        null,
        true,
      );
    } catch (error) {
      console.error("Error rejecting trainer:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  const handleApprove = () => {
    showModal(
      "Approve",
      "Are you sure you want to approve this trainer?",
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
    statusLabel === "Rejected" && reapproveEditMode && trainer;

  const infoItems = useMemo(
    () => [
      { label: "User Name", value: details.name },
      { label: "Gender", value: details.gender },
      { label: "Phone Number", value: details.phoneValue },
      { label: "Email Address", value: details.email },
      { label: "State", value: details.state },
      { label: "City", value: details.city },
      { label: "Bio", value: details.bio },
      { label: "Language", value: details.language },
      {
        label: "Specialization and Experience",
        value: details.experienceList.length ? details.experienceList : "-",
      },
    ],
    [details],
  );

  return (
    <DashboardLayout pageTitle="Trainer Request Details">
      <div className="container-fluid">
        <div className="dashCard doctor-request-view">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <h2 className="mainTitle mb-4">
              <BackButton2 />
              Trainer Details
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
                      <img
                        src={details.photo}
                        alt={details.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = images.placeholder;
                        }}
                      />
                    </div>
                  </div>

                  {statusLabel === "Pending" && (
                    <div className="doctor-request-actions">
                      <button
                        className="btn btn-primary"
                        onClick={handleApprove}
                        disabled={isSubmitting || statusLabel === "Approved"}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleReject}
                        disabled={isSubmitting || statusLabel === "Rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {statusLabel === "Rejected" && !reapproveEditMode && (
                    <div className="doctor-request-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleReApproveClick}
                        disabled={isSubmitting}
                      >
                        Re Approve
                      </button>
                    </div>
                  )}
                </div>
              )}

              {details?.rejection_reason &&
                statusLabel === "Rejected" &&
                !reapproveEditMode && (
                  <div className="doctor-info-grid mb-4">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <div className="detail-box">
                          <h6>Rejection Reason</h6>
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
                        <h6>Rejection Reason</h6>
                        <p className="mb-0">{details.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showReapproveForm ? (
                <DoctorReapproveForm
                  doctor={trainer}
                  doctorId={id}
                  editLockSecret={editLockSecret}
                  readOnlyEmail={details.email}
                  onCancel={() => setReapproveEditMode(false)}
                  onReleaseEditLock={releaseEditLock}
                  onSuccess={fetchTrainer}
                  showModal={showModal}
                  isSubmitting={isSubmitting}
                  startSubmitting={startSubmitting}
                  stopSubmitting={stopSubmitting}
                  successMessage="Trainer profile has been re-approved successfully."
                />
              ) : (
                <>
                  <div className="doctor-info-grid">
                    <div className="row">
                      {infoItems.map(({ label, value }) => (
                        <div className="col-xl-3 col-md-6 mb-3" key={label}>
                          <div className="detail-box">
                            <h6>{label}</h6>
                            <p className="mb-0">
                              {label === "Phone Number" &&
                                typeof value === "string" && (
                                  <span>
                                    {getCountryFlag(
                                      value,
                                      details.countryCode,
                                    )}
                                  </span>
                                )}
                              {label === "Specialization and Experience" &&
                              Array.isArray(value)
                                ? value.map((item) => (
                                    <div key={item.id}>
                                      {item.specialization} ({item.experience}{" "}
                                      years)
                                    </div>
                                  ))
                                : value}
                            </p>
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
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = images.placeholder;
                              }}
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

export default withModal(TrainerRequestView);
