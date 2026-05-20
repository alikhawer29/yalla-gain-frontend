import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../../Components/BackButton";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import {
  capitalizeFirstLetter,
  capitalizeStatus,
  dateFormat,
  getCountryFlag,
  isNullOrEmpty,
  timeFormat,
} from "../../../Utils/helper";
import { getDetails } from "../../../Services/Api";
import "./style.css";
import { images } from "../../../Assets";

const AppointmentDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [appointmentDetails, setAppointmentDetails] = useState();

  useEffect(() => {
    const getAppointmentDetails = async () => {
      try {
        const res = await getDetails(`/appointment/${id}/detail`);
        if (res?.status && res?.data) {
          setAppointmentDetails(res.data);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };
    getAppointmentDetails();
  }, [id]);

  if (isNullOrEmpty(appointmentDetails)) {
    return (
      <DashboardLayout pageTitle={t('pages.appointment_details')}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 ">
              <div className="row my-4">
                <h2 className="mainTitle mb-4">
                  <BackButton2 />
                  Appointment Details
                </h2>
              </div>
            </div>
          </div>
          <div className="dashCard">...</div>
        </div>
      </DashboardLayout>
    );
  }

  const user = appointmentDetails.user || {};
  const provider = appointmentDetails.service?.user || {};
  const userName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "-";
  const providerName =
    [provider.first_name, provider.last_name].filter(Boolean).join(" ") || "-";
  const contactNumber = `${appointmentDetails.dialing_code || ""}${appointmentDetails.phone || ""}`;
  const formatAppointmentTimeRange = (start, end) => {
    if (start && end) return `${timeFormat(start)} - ${timeFormat(end)}`;
    if (start) return timeFormat(start);
    if (end) return timeFormat(end);
    return "-";
  };
  const appointmentTime = formatAppointmentTimeRange(
    appointmentDetails.appointment_start_time,
    appointmentDetails.appointment_end_time,
  );
  const hasRescheduled = Boolean(
    appointmentDetails.rescheduled_appointment_date,
  );
  const rescheduledTime = hasRescheduled
    ? formatAppointmentTimeRange(
        appointmentDetails.rescheduled_appointment_start_time,
        appointmentDetails.rescheduled_appointment_end_time,
      )
    : "";
  const statusRaw = (appointmentDetails.status || "").toLowerCase();
  const status =
    statusRaw === "upcoming"
      ? "Upcoming"
      : statusRaw === "in-progress"
        ? "In-Progress"
        : statusRaw === "past"
          ? "Past"
          : statusRaw === "rejected"
            ? "Rejected"
            : appointmentDetails.status || "";
  const isRejected = statusRaw === "rejected";
  return (
    <DashboardLayout pageTitle={t('pages.appointment_details')}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 ">
            <div className="dashCard">
              <div className="row mb-4">
                <div className="col-12">
                  <h2 className="mainTitle mb-4">
                    <BackButton2 />
                    Booking Details
                  </h2>
                </div>
              </div>
              <div className="row ">
                <div className="col-12">
                  <div className="d-flex flex-md-row flex-column">
                    <div className="flex-grow-1 order-1 order-md-0">
                      <div className="row">
                        <div className="col-xxl-12 col-lg-8">
                          <div className="row my-2">
                            {[
                              {
                                label: "Booking ID:",
                                value: `#${appointmentDetails.id}`,
                              },
                              {
                                label: "Booking Date:",
                                value: dateFormat(
                                  appointmentDetails.created_at,
                                ),
                              },
                              {
                                label: "Session Type:",
                                value: capitalizeFirstLetter(
                                  appointmentDetails.service?.user?.type || "-",
                                ),
                              },
                              {
                                label: "Category:",
                                value: appointmentDetails.service?.title || "-",
                              },
                              {
                                label: "Appointment Date:",
                                value: dateFormat(
                                  appointmentDetails.appointment_date,
                                ),
                              },
                              {
                                label: "Appointment Time:",
                                value: appointmentTime,
                              },
                              ...(hasRescheduled
                                ? [
                                    {
                                      label: "Rescheduled Appointment Date:",
                                      value: dateFormat(
                                        appointmentDetails.rescheduled_appointment_date,
                                      ),
                                    },
                                    {
                                      label: "Rescheduled Appointment Time:",
                                      value: rescheduledTime,
                                    },
                                  ]
                                : []),
                              {
                                label: "Appointment Charges:",
                                value:
                                  `${appointmentDetails.amount_paid} Yalla Coins` ||
                                  "-",
                              },
                              {
                                label: "Sub Category:",
                                value:
                                  appointmentDetails.service?.description ||
                                  "-",
                              },
                              { label: "User Name:", value: userName },
                              { label: "Contact No:", value: contactNumber },
                              {
                                label: "Email Address:",
                                value: appointmentDetails.email,
                              },
                            ].map(({ label, value }) => (
                              <div
                                className="col-xxl-3 col-xl-6 mb-3"
                                key={label}
                              >
                                <div className="detail-box">
                                  <h6 className="">{label}</h6>
                                  <p className="mb-0">
                                    {label === "Contact No:" && (
                                      <span>{getCountryFlag(value)}</span>
                                    )}{" "}
                                    {value}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ">
                      <div className="">
                        <label
                          style={{ color: "#FFFFFF" }}
                          className="fw-medium"
                        >
                          Status:
                        </label>
                        <span
                          style={{
                            color:
                              status === "Rejected"
                                ? "#FF4F25"
                                : status === "Upcoming"
                                  ? "#FFFFFF"
                                  : status === "In-Progress"
                                    ? "#FFFFFF"
                                    : status === "Past"
                                      ? "#FFFFFF"
                                      : "#FF4F25",
                          }}
                          className={`ms-3 fw-semibold`}
                        >
                          {capitalizeStatus(status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isRejected && appointmentDetails.rejection_reason && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="detail-box appointment-rejection-box">
                      <h6>Rejection Reason</h6>
                      <p className="mb-0 appointment-rejection-reason">
                        {appointmentDetails.rejection_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="row mt-md-3 mt-0">
                <div className="col-xxl-8">
                  <div className="row">
                    <div className="col-md-6 mb-md-0 mb-3">
                      <h2 className="mb-2" style={{ color: "#FFFFFF" }}>
                        User Detail
                      </h2>
                      <div className="booking-detail-card">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div className="d-flex gap-sm-3 gap-2 align-items-center">
                            <img
                              className="smallProfileImage"
                              src={user?.photo}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = images.adminProfileImg;
                                e.target.alt = "User";
                              }}
                            />
                            <h4
                              style={{ fontSize: 18, color: "#FFFFFF" }}
                              className="mb-0"
                            >
                              {userName}
                            </h4>
                            <div className="">
                              <Link
                                style={{ fontSize: 14, color: "#FFFFFF" }}
                                to={`/admin/user-management/${user?.id}`}
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-md-0 mb-3">
                      <h2 className="mb-2" style={{ color: "#FFFFFF" }}>
                        Consultant Detail
                      </h2>
                      <div className="booking-detail-card">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <div className="d-flex gap-sm-3 gap-2 align-items-center">
                            <img
                              className="roundedBorders smallProfileImage"
                              src={provider?.photo}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = images.adminProfileImg;
                                e.target.alt = "Provider";
                              }}
                            />
                            <h4
                              style={{ fontSize: 18, color: "#FFFFFF" }}
                              className="mb-0"
                            >
                              {providerName}
                            </h4>
                            <div className="" style={{ color: "#FFFFFF" }}>
                              <Link
                                style={{ fontSize: 14, color: "#FFFFFF" }}
                                to={`/admin/${appointmentDetails?.service?.user?.type === "doctor" ? "doctor-management" : "trainer-management"}/${appointmentDetails?.service?.user?.id}`}
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {appointmentDetails.status == "Past" && (
                <div className="row mt-3">
                  <div className="col-12">
                    <h2>Rating</h2>
                    {Array(parseInt(appointmentDetails.ratings))
                      .fill()
                      .map((_, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={faStar}
                          size="xl"
                          style={{ color: "#FFA929", cursor: "pointer" }}
                        />
                      ))}
                  </div>
                  <div className="col-xxl-4 mt-3">
                    <div className="detail-box">
                      <h6>Review</h6>
                      <p className="mb-0">{appointmentDetails.review}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetails;
