import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BookingStatusText from "../../../Components/BookingStatusText";
import {
  capitalizeFirstLetter,
  dateFormat,
  getCountryFlag,
} from "../../../Utils/helper";
import {
  formatUtcToLocalDate,
  getBookingLocalTimeRange,
} from "../../../Utils/timezone";
import { formatAppointmentChargesDisplay } from "../../../Utils/appointmentCharges";
import { getDetails } from "../../../Services/Api";
import "./style.css";
import { images } from "../../../Assets";

const appointmentDetailsSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const AppointmentDetailsSkeleton = () => (
  <>
    <div className="row ">
      <div className="col-12">
        <div className="d-flex flex-md-row flex-column">
          <div className="flex-grow-1 order-1 order-md-0">
            <div className="row">
              <div className="col-xxl-12 col-lg-8">
                <div className="row my-2">
                  {Array.from({ length: 12 }, (_, index) => (
                    <div
                      className="col-xxl-3 col-xl-6 mb-3"
                      key={`appointment-field-sk-${index}`}
                    >
                      <div className="detail-box">
                        <Skeleton
                          width="65%"
                          height={16}
                          {...appointmentDetailsSkeletonProps}
                          className="mb-2"
                        />
                        <Skeleton
                          width="80%"
                          height={20}
                          {...appointmentDetailsSkeletonProps}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Skeleton
              width={140}
              height={24}
              {...appointmentDetailsSkeletonProps}
            />
          </div>
        </div>
      </div>
    </div>
    <div className="row mt-md-3 mt-0">
      <div className="col-xxl-8">
        <div className="row">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              className="col-md-6 mb-md-0 mb-3"
              key={`appointment-card-sk-${index}`}
            >
              <Skeleton
                width={120}
                height={24}
                {...appointmentDetailsSkeletonProps}
                className="mb-2"
              />
              <div className="booking-detail-card">
                <div className="d-flex gap-sm-3 gap-2 align-items-center">
                  <Skeleton
                    circle
                    width={48}
                    height={48}
                    {...appointmentDetailsSkeletonProps}
                  />
                  <Skeleton
                    width={140}
                    height={22}
                    {...appointmentDetailsSkeletonProps}
                  />
                  <Skeleton
                    width={90}
                    height={18}
                    {...appointmentDetailsSkeletonProps}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const AppointmentDetails = () => {
  const { id } = useParams();

  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const getAppointmentDetails = async () => {
      setLoading(true);
      try {
        const res = await getDetails(`/appointment/${id}/detail`);
        if (!cancelled) {
          if (res?.status && res?.data) {
            setAppointmentDetails(res.data);
          } else {
            setAppointmentDetails(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching appointment details:", error);
          setAppointmentDetails(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getAppointmentDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const user = appointmentDetails?.user || {};
  const provider = appointmentDetails?.service?.user || {};
  const userName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "-";
  const providerName =
    [provider.first_name, provider.last_name].filter(Boolean).join(" ") || "-";
  const rawPhone = appointmentDetails?.phone || "";
  const dialingCode = appointmentDetails?.dialing_code || "";

  const contactNumber =
    rawPhone.startsWith(dialingCode) || rawPhone.startsWith(`+${dialingCode}`)
      ? rawPhone
      : `${dialingCode}${rawPhone}`;
  const appointmentTime = getBookingLocalTimeRange(appointmentDetails);
  const hasRescheduled = appointmentDetails?.is_rescheduled;
  const rescheduledStartUtc =
    appointmentDetails?.rescheduled_scheduled_start_at ||
    appointmentDetails?.rescheduled_start_at;
  const rescheduledEndUtc =
    appointmentDetails?.rescheduled_scheduled_end_at ||
    appointmentDetails?.rescheduled_end_at;
  const rescheduledTime = hasRescheduled
    ? getBookingLocalTimeRange({
        scheduled_start_at: rescheduledStartUtc,
        scheduled_end_at: rescheduledEndUtc,
      })
    : "";
  const appointmentLocalDate =
    formatUtcToLocalDate(appointmentDetails?.scheduled_start_at) ||
    dateFormat(appointmentDetails?.appointment_date) ||
    "-";
  const rescheduledLocalDate = hasRescheduled
    ? formatUtcToLocalDate(rescheduledStartUtc) ||
      dateFormat(appointmentDetails?.rescheduled_appointment_date) ||
      "-"
    : "";
  const statusRaw = (appointmentDetails?.status || "").toLowerCase();
  const isRejected = statusRaw === "rejected";
  const ratingValue = Number(appointmentDetails?.ratings);
  const ratingStars = Number.isFinite(ratingValue)
    ? Math.min(5, Math.max(0, Math.round(ratingValue)))
    : 0;
  const showRatingSection =
    (statusRaw === "past" || appointmentDetails?.status === "Past") &&
    (ratingStars > 0 || appointmentDetails?.review);

  return (
    <DashboardLayout pageTitle="Appointment Details">
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
              {loading ? (
                <AppointmentDetailsSkeleton />
              ) : !appointmentDetails ? (
                <p className="detail-value mb-0">
                  Appointment details not found.
                </p>
              ) : (
                <>
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
                                      appointmentDetails.service?.user?.type ||
                                        "-",
                                    ),
                                  },
                                  {
                                    label: "Category:",
                                    value:
                                      appointmentDetails.service?.title || "-",
                                  },
                                  {
                                    label: "Appointment Date:",
                                    value: appointmentLocalDate,
                                  },
                                  {
                                    label: "Appointment Time:",
                                    value: appointmentTime,
                                  },
                                  ...(hasRescheduled
                                    ? [
                                        {
                                          label:
                                            "Rescheduled Appointment Date:",
                                          value: rescheduledLocalDate,
                                        },
                                        {
                                          label:
                                            "Rescheduled Appointment Time:",
                                          value: rescheduledTime,
                                        },
                                      ]
                                    : []),
                                  {
                                    label: "Appointment Charges:",
                                    value: formatAppointmentChargesDisplay(
                                      appointmentDetails,
                                    ),
                                  },
                                  {
                                    label: "Sub Category:",
                                    value:
                                      appointmentDetails.service?.description ||
                                      "-",
                                  },
                                  { label: "User Name:", value: userName },
                                  {
                                    label: "Contact No:",
                                    value: contactNumber,
                                  },
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
                            <BookingStatusText
                              status={appointmentDetails.status}
                              variant="text"
                              className="ms-3 fw-semibold"
                            />
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
                  {showRatingSection && (
                    <div className="row mt-3">
                      {ratingStars > 0 && (
                        <div className="col-12">
                          <h2>Rating</h2>
                          {Array.from({ length: ratingStars }, (_, index) => (
                            <FontAwesomeIcon
                              key={index}
                              icon={faStar}
                              size="xl"
                              style={{ color: "#FFA929" }}
                            />
                          ))}
                        </div>
                      )}
                      {appointmentDetails?.review && (
                        <div className="col-xxl-4 mt-3">
                          <div className="detail-box">
                            <h6>Review</h6>
                            <p className="mb-0">{appointmentDetails.review}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetails;
