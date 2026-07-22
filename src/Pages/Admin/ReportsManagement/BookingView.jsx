import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import withModal from "../../../HOC/withModal";
import { images } from "../../../Assets";
import {
  capitalizeFirstLetter,
  dateFormat,
} from "../../../Utils/helper";
import {
  formatUtcToLocalDate,
  getBookingLocalTimeRange,
} from "../../../Utils/timezone";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";

const BookingView = ({ showModal, reasonModal, closeModal }) => {
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
    <DashboardLayout pageTitle="View Report">
      <div className="container-fluid">
        <div className="dashCard report-view">
          <h2 className="mainTitle mb-4">
            <BackButton2 /> View Report
          </h2>
          <div className="d-flex flex-md-row flex-column mb-3">
            <div className="flex-grow-1 order-1 order-md-0">
              <div className="row">
                <div className="col-xxl-10 col-lg-9">
                  {/* User Detail */}
                  <div className="mb-4">
                    <h2 className="my-2 sub-title">User Detail</h2>
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
                            <span className="info-label">User Name</span>
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
                            View User Details
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
                      Detail
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
                              Name
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
                            View{" "}
                            {capitalizeFirstLetter(
                              detail?.appointment?.service?.user?.type ||
                                "trainer",
                            )}{" "}
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      {[
                        {
                          label: "Service Name",
                          value: detail?.appointment?.service?.title,
                        },
                        {
                          label: "Service Charges",
                          value: `${detail?.appointment?.service?.charges ?? "-"} Yalla Coins`,
                        },
                        {
                          label: "User Type",
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
                  <h2 className="mb-4 sub-title">Booking Details</h2>
                  <div className="row my-2">
                    {[
                      {
                        label: "Booking ID",
                        value: `#${detail?.appointment?.id}`,
                      },
                      {
                        label: "Booking Date",
                        value: dateFormat(detail?.appointment?.created_at),
                      },
                      {
                        label: "Appointment Date",
                        value:
                          formatUtcToLocalDate(
                            detail?.appointment?.scheduled_start_at,
                          ) || detail?.appointment?.appointment_date,
                      },
                      {
                        label: "Appointment Time",
                        value: getBookingLocalTimeRange(detail?.appointment),
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
                  <h2 className="mb-4 sub-title">Report Details</h2>
                  <div className="row my-2">
                    {[
                      {
                        label: "Report Date",
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
                        <h6>Message</h6>
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
