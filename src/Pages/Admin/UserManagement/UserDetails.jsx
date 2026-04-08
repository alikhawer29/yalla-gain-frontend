import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
// import { getDetails } from "../../../Services/Api";
import { images } from "../../../Assets";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import {
  bookingsLogsHeaders,
  challengeLogsHeaders,
  subscriptionLogsHeaders,
} from "../../../Config/TableHeaders";
import {
  activeExpiredStatus,
  bookingTypeStatus,
  ongoingStatus,
  statusOptions,
} from "../../../Config/TableStatus";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { usePagination } from "../../../Hooks/usePagination";
import { getAll, getDetails, post } from "../../../Services/Api";
import {
  clickableTableRowNavProps,
  getCountryFlag,
  serialNum,
} from "../../../Utils/helper";

const profileSkeletonProps = {
  baseColor: "#e8e8e8",
  highlightColor: "#f0f0f0",
};

const UserDetails = ({
  showModal /*, filters, setFilters, pagination, updatePagination */,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [bookingLogs, setBookingLogs] = useState([]);
  const [challnegeLogs, setChallengeLogs] = useState([]);
  const [subscriptionLogs, setSubscriptionLogs] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  // Separate filters for each table
  const defaultFilters = {
    page: 1,
    per_page: 10,
    search: "",
    fromDate: "",
    toDate: "",
    status: "",
  };

  const [bookingFilters, setBookingFilters] = useState({ ...defaultFilters });
  const [challengeFilters, setChallengeFilters] = useState({
    ...defaultFilters,
  });
  const [subscriptionFilters, setSubscriptionFilters] = useState({
    ...defaultFilters,
  });

  // Separate pagination for each table
  const [bookingPagination, updateBookingPagination] = usePagination(
    bookingFilters.page,
    bookingFilters.per_page,
  );
  const [challengePagination, updateChallengePagination] = usePagination(
    challengeFilters.page,
    challengeFilters.per_page,
  );
  const [subscriptionPagination, updateSubscriptionPagination] = usePagination(
    subscriptionFilters.page,
    subscriptionFilters.per_page,
  );

  useEffect(() => {
    updateBookingPagination({ perPage: bookingFilters.per_page });
  }, [bookingFilters.per_page, updateBookingPagination]);

  useEffect(() => {
    updateChallengePagination({ perPage: challengeFilters.per_page });
  }, [challengeFilters.per_page, updateChallengePagination]);

  useEffect(() => {
    updateSubscriptionPagination({ perPage: subscriptionFilters.per_page });
  }, [subscriptionFilters.per_page, updateSubscriptionPagination]);

  const fetchBookings = async () => {
    try {
      startSubmitting(true);
      const url = `/appointments/${id}`;
      const response = await getAll(url, bookingFilters);
      //   const response = userBookingLogsData;
      if (response.status) {
        const { data } = response;
        const { total, per_page, current_page, to } = response?.meta;
        setBookingLogs(data);
        updateBookingPagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.ceil(total / per_page),
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  const fetchChallneges = async () => {
    try {
      startSubmitting(true);
      const url = `/challenge/${id}/listing`;
      const response = await getAll(url, challengeFilters);
      // const response = challengeLogsData;
      if (response.status) {
        const { data } = response;
        const { total, per_page, current_page, to } = response?.meta;
        setChallengeLogs(data);
        updateChallengePagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.ceil(total / per_page),
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      stopSubmitting(false);
    }
  };
  const fetchSubscriptions = async () => {
    try {
      startSubmitting(true);
      const url = `/subscription-logs/${id}`;
      const response = await getAll(url, subscriptionFilters);
      // const response = subscriptionLogsData;
      if (response.status) {
        const { data } = response;
        const { total, per_page, current_page, to } = response?.meta;
        setSubscriptionLogs(data);
        updateSubscriptionPagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.ceil(total / per_page),
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  const getUser = async () => {
    setProfileLoading(true);
    try {
      const response = await getDetails(`/user/${id}`);
      const payload = response?.data;
      setProfileData(
        payload && typeof payload === "object" && !Array.isArray(payload)
          ? payload
          : {},
      );
    } catch (error) {
      console.error("Error fetching user:", error);
      setProfileData({});
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  // Trigger fetches when each table's filters change
  useEffect(() => {
    fetchBookings();
  }, [bookingFilters]);

  useEffect(() => {
    fetchChallneges();
  }, [challengeFilters]);

  useEffect(() => {
    fetchSubscriptions();
  }, [subscriptionFilters]);

  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    showModal(
      `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this user's status to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      }?`,
      () => onConfirmStatusChange(userId, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (userId, newStatusValue) => {
    await post(`/user/${userId}/status`, { status: newStatusValue });
    // setProfileData((prevData) => ({
    //     ...prevData,
    //     status: newStatusValue,
    // }));
    getUser();
    showModal(
      "Successful",
      `User status has been changed to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      } successfully.`,
      null,
      true,
    );
  };

  const { email, phone, first_name, last_name, dob, dialing_code } =
    profileData;
  const displayName = [first_name, last_name].filter(Boolean).join(" ").trim();
  const displayPhone = [dialing_code, phone].filter(Boolean).join("");
  const detailFields = [
    { label: "User Name", value: displayName || "—" },
    { label: "Email Address", value: email ?? "—" },
    { label: "Date Of Birth", value: dob ?? "—" },
    { label: "Phone Number", value: displayPhone || "—", isPhone: true },
  ];

  return (
    <DashboardLayout pageTitle="User Details">
      <div className="user-details">
        <div className="row dashCard mb-5">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div className="d-flex">
                <BackButton2 />
                <h2 className="mainTitle mb-0">User Details</h2>
              </div>
              <div className="d-flex justify-content-start justify-content-sm-end">
                <div className="profile-status d-flex  align-items-end flex-column gap-3">
                  {profileLoading ? (
                    <Skeleton
                      width={160}
                      height={44}
                      borderRadius={8}
                      {...profileSkeletonProps}
                    />
                  ) : (
                    <div className="status-action">
                      <Select
                        className={`tabel-select status${profileData?.status ? "Active" : "Inactive"}`}
                        id={`status${id}`}
                        name="status"
                        label=""
                        value={profileData?.status ? "1" : "0"}
                        onChange={(e) => handleStatusChange(e, id)}
                        labelclass="me-2 mb-0"
                      >
                        {statusOptions}
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            {profileLoading ? (
              <>
                <div className="d-flex align-items-center gap-5 mb-4 flex-wrap">
                  <Skeleton
                    circle
                    width={120}
                    height={120}
                    {...profileSkeletonProps}
                  />
                  <Skeleton
                    width={140}
                    height={42}
                    borderRadius={8}
                    {...profileSkeletonProps}
                  />
                </div>
                <div className="row">
                  <div className="col-xxl-9 col-lg-11">
                    <div className="row mb-4">
                      {detailFields.map(({ label }) => (
                        <div className="col-xl-3 col-md-6 mb-3" key={label}>
                          <div className="detail-box">
                            <Skeleton
                              width="55%"
                              height={16}
                              {...profileSkeletonProps}
                              className="mb-2"
                            />
                            <Skeleton
                              width="90%"
                              height={22}
                              {...profileSkeletonProps}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex align-items-center gap-5 mb-4">
                  <div className="detail-box-img">
                    <img
                      src={profileData?.photo ?? images.placeholder}
                      alt="User"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = images.adminProfileImg;
                        e.target.alt = "User";
                      }}
                    />
                  </div>
                  <Link
                    className="btn btn-primary"
                    to={`/admin/user-management/${id}/user-post`}
                  >
                    User Post
                  </Link>
                </div>
                <div className="row">
                  <div className="col-xxl-9 col-lg-11">
                    <div className="row mb-4">
                      {detailFields.map(({ label, value, isPhone }) => (
                        <div className="col-xl-3 col-md-6 mb-3" key={label}>
                          <div className="detail-box">
                            <h6 className="">{label}</h6>
                            <p className=" mb-0">
                              {isPhone && value && value !== "—" && (
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
              </>
            )}
          </div>
        </div>
        <div className="row dashCard mb-3">
          <div className="col-12">
            <h2 className="mainTitle">Booking Logs</h2>
          </div>
          <div className="col-12">
            <CustomTable
              filters={bookingFilters}
              setFilters={setBookingFilters}
              loading={isSubmitting}
              headers={bookingsLogsHeaders}
              pagination={bookingPagination}
              // if you want multiple date filters
              dateFilters={[
                {
                  title: "Date",
                  from: "fromDate",
                  to: "toDate",
                  fromTitle: "From",
                  toTitle: "To",
                },
              ]}
              selectOptions={[
                {
                  main_title: "Filter by status",
                  title: "status",
                  options: bookingTypeStatus,
                },
              ]}
            >
              <tbody>
                {bookingLogs?.map((item, index) => (
                  <tr
                    key={item?.id}
                    {...(item?.id
                      ? clickableTableRowNavProps(
                          navigate,
                          `/admin/appointments/${item.id}`,
                        )
                      : {})}
                  >
                    <td>
                      {serialNum(
                        (bookingFilters.page - 1) * bookingFilters.per_page +
                          index +
                          1,
                      )}
                    </td>
                    <td>{item?.booking_id}</td>
                    <td>{item?.service?.user?.type}</td>
                    <td>{item?.appointment_date}</td>
                    <td>
                      {item?.amount_paid != null && item?.amount_paid !== ""
                        ? `${item.amount_paid} Yalla Coins`
                        : "—"}
                    </td>
                    <td
                      style={{
                        color:
                          item.status === "pending"
                            ? "#FDB332"
                            : item.status === "upcoming"
                              ? "#FF5C5C"
                              : item.status === "past"
                                ? "#999999"
                                : "#4CD964",
                      }}
                    >
                      {item?.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </CustomTable>
          </div>
        </div>
        <div className="row dashCard mb-3">
          <div className="col-12">
            <h2 className="mainTitle">Challenges</h2>
          </div>
          <div className="col-12">
            <CustomTable
              filters={challengeFilters}
              setFilters={setChallengeFilters}
              loading={isSubmitting}
              headers={challengeLogsHeaders}
              pagination={challengePagination}
              // if you want multiple date filters
              dateFilters={[
                {
                  title: "Date",
                  from: "fromDate",
                  to: "toDate",
                  fromTitle: "From",
                  toTitle: "To",
                },
              ]}
              selectOptions={[
                {
                  main_title: "Filter by status",
                  title: "status",
                  options: ongoingStatus,
                },
              ]}
            >
              <tbody>
                {challnegeLogs?.map((item, index) => (
                  <tr key={item?.id}>
                    <td>
                      {serialNum(
                        (challengeFilters.page - 1) *
                          challengeFilters.per_page +
                          index +
                          1,
                      )}
                    </td>
                    <td>{item?.challenge?.title}</td>
                    <td>{item?.challenge?.type}</td>
                    <td>{item?.start_date}</td>
                    <td
                      style={{
                        color:
                          item.status === "ongoing"
                            ? "#FDB332"
                            : item.status === "failed"
                              ? "#FF5C5C"
                              : item.status === "completed"
                                ? "#4CD964"
                                : "",
                      }}
                    >
                      {item?.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </CustomTable>
          </div>
        </div>
        <div className="row dashCard mb-3">
          <div className="col-12">
            <h2 className="mainTitle">Subscription Logs</h2>
          </div>
          <div className="col-12">
            <CustomTable
              filters={subscriptionFilters}
              setFilters={setSubscriptionFilters}
              loading={isSubmitting}
              headers={subscriptionLogsHeaders}
              pagination={subscriptionPagination}
              // if you want multiple date filters
              dateFilters={[
                {
                  title: "Date",
                  from: "from_payment_date",
                  to: "to_payment_date",
                  fromTitle: "From",
                  toTitle: "To",
                },
              ]}
              selectOptions={[
                {
                  main_title: "Filter by status",
                  title: "status",
                  options: activeExpiredStatus,
                },
              ]}
            >
              <tbody>
                {subscriptionLogs?.map((item, index) => (
                  <tr key={item?.id}>
                    <td>
                      {serialNum(
                        (subscriptionFilters.page - 1) *
                          subscriptionFilters.per_page +
                          index +
                          1,
                      )}
                    </td>
                    <td>{item?.subscription_plan?.title}</td>
                    <td>{item?.subscription_plan?.duration}</td>
                    <td>
                      {item?.price_paid != null && item?.price_paid !== ""
                        ? `$${item.price_paid}`
                        : "—"}
                    </td>
                    <td>{item?.subscribed_on}</td>
                    <td>{item?.expired_on}</td>
                    <td
                      style={{
                        color:
                          item.is_active == true
                            ? "#4CD964"
                            : item.status == false
                              ? "#FF5C5C"
                              : "",
                      }}
                    >
                      {item?.is_active == true ? "Active" : "Expired"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </CustomTable>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
//Additional Filters
const additionalFilters = {
  type: "",
  expiryFromDate: "",
  expiryToDate: "",
};
export default withModal(withFilters(UserDetails, additionalFilters));
