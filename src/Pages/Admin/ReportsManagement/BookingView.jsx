import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import withModal from "../../../HOC/withModal";
import { images } from "../../../Assets";
import {
  capitalizeFirstLetter,
  dateFormat,
  timeFormat,
} from "../../../Utils/helper";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";

const BookingView = ({ showModal, reasonModal, closeModal }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [status, setStatus] = useState("Pending");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getDetails(`/reports/booking/${id}`);
        if (res?.status && res?.data) {
          const data = res.data;
          const mapped = {
            reportId: `#${data?.id ?? "-"}`,
            reportedOn: data?.created_at ?? "",
            reason: data?.reason ?? "",
            appointment: {
              ...data?.appointment,
              user: {
                id: data?.appointment?.user?.id,
                first_name: data?.appointment?.user?.first_name,
                last_name: data?.appointment?.user?.last_name,
                email: data?.appointment?.user?.email,
                phone: data?.appointment?.user?.phone,
                photo: data?.appointment?.user?.photo || images.placeholder,
              },
              service: {
                title: data?.appointment?.service?.title,
                charges:
                  data?.appointment?.amount_paid ||
                  data?.appointment?.service?.charges,
                user: {
                  id: data?.appointment?.service?.user?.id,
                  first_name: data?.appointment?.service?.user?.first_name,
                  last_name: data?.appointment?.service?.user?.last_name,
                  type: data?.appointment?.service?.user?.type,
                  photo:
                    data?.appointment?.service?.user?.photo ||
                    images.placeholder,
                },
              },
            },
          };
          setDetail(mapped);
          setStatus(data?.status === 1 ? "Pending" : "Resolved");
        }
      } catch (e) {
        console.error("Error fetching booking report detail:", e);
      }
    };
    fetchDetail();
  }, [id]);

  const onResolve = () => {
    showModal(
      "Resolved Report",
      "Are you sure you want to mark this report as Resolved?",
      async () => {
        try {
          const res = await post(`/reports/booking/${id}/status`, {});
          if (res?.status) {
            setStatus("Resolved");
            reasonModal(
              null,
              "Report has been marked resolved",
              closeModal,
              true,
              false,
              "",
              "",
              "",
              "",
              true,
            );
          } else {
            // show a simple success-style modal with failure text to keep UI consistent
            showModal(
              "Failed",
              res?.message || "Could not resolve report.",
              null,
              true,
            );
          }
        } catch (e) {
          console.error("Error updating booking report status:", e);
          showModal("Failed", "Could not resolve report.", null, true);
        }
      },
      false,
    );
  };

  return (
    <DashboardLayout pageTitle={t('pages.view_report')}>
      <div className="container-fluid">
        <div className="dashCard report-view">
          <h2 className="mainTitle mainTitle--with-back mb-4">
            <BackButton2 /> {t("pages.view_report")}
          </h2>
          <div className="d-flex flex-md-row flex-column mb-3">
            <div className="flex-grow-1 order-1 order-md-0">
              <div className="row">
                <div className="col-xxl-10 col-lg-9">
                  {/* User Detail */}
                  <div className="mb-4">
                    <h2 className="my-2 sub-title">{t("booking.user_detail")}</h2>
                    <div className="booking-detail-card">
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="d-flex gap-sm-3 gap-2 align-items-center">
                          {/* <img className="smallProfileImage roundedBorders" src={detail?.appointment?.user?.photo || images.placeholder} alt="user" /> */}
                          <div className="d-flex align-items-center gap-5 my-4">
                            <div className="detail-box-img">
                              <img
                                src={detail?.appointment?.user?.photo}
                                alt="user"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="info-label">{t("fields.user_name")}</span>
                            <p
                              className="info-value mb-0"
                              style={{ fontSize: 16 }}
                            >
                              {[
                                detail?.appointment?.user?.first_name,
                                detail?.appointment?.user?.last_name,
                              ]
                                .filter(Boolean)
                                .join(" ") || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="ms-3">
                          <Link
                            className="btn btn-secondary"
                            to={`/admin/user-management/${detail?.appointment?.user?.id || ""}`}
                          >
                            {t("booking.view_user_details")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trainer/Doctor Detail */}
                  <div className="mb-4">
                    <h2 className="mb-2 sub-title">
                      {capitalizeFirstLetter(
                        detail?.appointment?.service?.user?.type || "Trainer",
                      )}{" "}
                      {t("booking.consultant_detail")}
                    </h2>
                    <div className="booking-detail-card">
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="d-flex gap-sm-3 gap-2 align-items-center">
                          {/* <img className="smallProfileImage roundedBorders" src={detail?.appointment?.service?.user?.photo || images.placeholder} alt="provider" /> */}
                          <div className="d-flex align-items-center gap-5 my-4">
                            <div className="detail-box-img">
                              <img
                                src={detail?.appointment?.service?.user?.photo}
                                alt="user"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="info-label">
                              {capitalizeFirstLetter(
                                detail?.appointment?.service?.user?.type ||
                                  "Trainer",
                              )}{" "}
                              {t("fields.user_name")}
                            </span>
                            <p
                              className="info-value mb-0"
                              style={{ fontSize: 16 }}
                            >
                              {[
                                detail?.appointment?.service?.user?.first_name,
                                detail?.appointment?.service?.user?.last_name,
                              ]
                                .filter(Boolean)
                                .join(" ") || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="ms-3">
                          <Link
                            className="btn btn-secondary"
                            to={`/admin/${detail?.appointment?.service?.user?.type === "doctor" ? "doctor" : "trainer"}-management/${detail?.appointment?.service?.user?.id || ""}`}
                          >
                            {detail?.appointment?.service?.user?.type === "doctor"
                              ? t("booking.view_doctor_details")
                              : t("booking.view_trainer_details")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      {[
                        {
                          label: t("booking.service_name"),
                          value: detail?.appointment?.service?.title,
                        },
                        {
                          label: t("booking.service_charges"),
                          value: `${detail?.appointment?.service?.charges ?? "-"} ${t("booking.yalla_coins")}`,
                        },
                        {
                          label: t("booking.user_type"),
                          value: capitalizeFirstLetter(
                            detail?.appointment?.service?.user?.type || "-",
                          ),
                        },
                      ].map(({ label, value }) => (
                        <div className="col-xxl-3 col-xl-6 mb-3" key={label}>
                          <div className="detail-box">
                            <h6>{label}</h6>
                            <p className="mb-0">{value || "-"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <h2 className="mb-4 sub-title">{t("booking.details")}</h2>
                  <div className="row my-2">
                    {[
                      {
                        label: t("booking.booking_id"),
                        value: `#${detail?.appointment?.id}`,
                      },
                      {
                        label: t("booking.booking_date"),
                        value: dateFormat(detail?.appointment?.created_at),
                      },
                      {
                        label: t("booking.appointment_date"),
                        value: detail?.appointment?.appointment_date,
                      },
                      {
                        label: t("booking.appointment_time"),
                        value: timeFormat(
                          detail?.appointment?.appointment_start_time,
                        )
                          ? `${timeFormat(detail?.appointment?.appointment_start_time)} - ${timeFormat(detail?.appointment?.appointment_end_time)}`
                          : "-",
                      },
                    ].map(({ label, value }) => (
                      <div className="col-xxl-3 col-xl-6 mb-3" key={label}>
                        <div className="detail-box">
                          <h6>{label}</h6>
                          <p className="mb-0">{value || "-"}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Report Details */}
                  <h2 className="mb-4 sub-title">{t("booking.report_details")}</h2>
                  <div className="row my-2">
                    {[
                      {
                        label: t("booking.report_date"),
                        value: dateFormat(detail?.reportedOn),
                      },
                    ].map(({ label, value }) => (
                      <div className="col-xxl-3 col-xl-6 mb-3" key={label}>
                        <div className="detail-box">
                          <h6>{label}</h6>
                          <p className="mb-0">{value || "-"}</p>
                        </div>
                      </div>
                    ))}
                    <div className="col-xxl-6 col-xl-12 mb-3">
                      <div className="detail-box">
                        <h6>{t("booking.message")}</h6>
                        <p className="mb-0">{detail?.reason || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {status === "Pending" && (
                    <div className="mt-2">
                      <button className="btn btn-primary" onClick={onResolve}>
                        Mark As Resolved
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 ms-md-4 mb-3">
              <div>
                <label style={{ color: "#666" }} className="fw-medium">
                  Status
                </label>
                <span
                  className={`ms-2 fw-semibold status ${status.toLowerCase()}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(BookingView);
