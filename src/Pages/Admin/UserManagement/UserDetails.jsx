import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
// import { getDetails } from "../../../Services/Api";
import { images } from "../../../Assets";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import { challengeLogsData, subscriptionLogsData, userBookingLogsData, userManagementData } from "../../../Config/data";
import { bookingsLogsHeaders, challengeLogsHeaders, subscriptionLogsHeaders } from "../../../Config/TableHeaders";
import { activeExpiredStatus, bookingTypeStatus, ongoingStatus, statusOptions } from "../../../Config/TableStatus";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getCountryFlag, serialNum } from "../../../Utils/helper";

const UserDetails = ({ showModal, filters, setFilters, pagination, updatePagination }) => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});
  const [bookingLogs, setBookingLogs] = useState([]);
  const [challnegeLogs, setChallengeLogs] = useState([]);
  const [subscriptionLogs, setSubscriptionLogs] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const fetchBookings = async () => {
    try {
      startSubmitting(true);
      // const url = `/admin-api/users`;
      // const response = await getAll(url, filters);
      const response = userBookingLogsData;
      if (response.status) {
        const { data, total, per_page, current_page, to } = response.detail;
        setBookingLogs(data);
        updatePagination({
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
      // const url = `/admin-api/users`;
      // const response = await getAll(url, filters);
      const response = challengeLogsData;
      if (response.status) {
        const { data, total, per_page, current_page, to } = response.detail;
        setChallengeLogs(data);
        updatePagination({
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
      // const url = `/admin-api/users`;
      // const response = await getAll(url, filters);
      const response = subscriptionLogsData;
      if (response.status) {
        const { data, total, per_page, current_page, to } = response.detail;
        setSubscriptionLogs(data);
        updatePagination({
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

  useEffect(() => {
    const getUser = async () => {
      const response = userManagementData.detail.data.find((e) => e.id === Number(id));

      // const response = await getDetails(`/admin-api/users/${id}`);
      if (response) {
        // setProfileData(response.detail);
        setProfileData(response);
      }
    };
    getUser();
  }, [id]);

  useEffect(() => {
    fetchBookings();
    fetchChallneges();
    fetchSubscriptions();
  }, [filters]);

  // Handle status change
  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    // Open the modal for confirmation
    showModal(``, `Are you sure you want to change this user status to ${newStatusValue === "1" ? "Active" : "Inactive"}?`, () =>
      onConfirmStatusChange(userId, newStatusValue)
    );
  };

  // Confirm status change and update the state
  const onConfirmStatusChange = async (userId, newStatusValue) => {
    // Update the status in the appointmentLogs state
    setProfileData({ ...profileData, status_detail: newStatusValue });
    showModal("", `User status has been changed to ${newStatusValue === "1" ? "Active" : "Inactive"} successfully.`, null, true);
  };

  const { email, phone_number, user_name, date_of_birth, id: user_id } = profileData;
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
                  <div className="status-action">
                    <Select
                      className={`tabel-select status${profileData?.status_detail}`}
                      id={`status${profileData?.id}`}
                      name="status"
                      label="Status:"
                      value={profileData?.status_detail}
                      onChange={(e) => handleStatusChange(e, profileData?.id)}
                      labelclass="me-2 mb-0"
                    >
                      {statusOptions}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex align-items-center gap-5 mb-4">
            <div className="detail-box-img">
              <img src={profileData?.UserImage ?? images.placeholder} alt="User" />
            </div>
            <Link className="btn btn-primary" to={`/admin/user-management/${user_id}/user-post`}>User Post</Link>
            </div>
            <div className="row">
              <div className="col-xxl-9 col-lg-11">
                <div className="row mb-4">
                  {[
                    { label: "User Name", value: user_name },
                    { label: "Email Address", value: email },
                    { label: "Date Of Birth", value: date_of_birth },
                    { label: "Phone Number", value: phone_number },
                  ].map(({ label, value }) => (
                    <div className="col-xl-3 col-md-6 mb-3" key={label}>
                      <div className="detail-box">
                        <h6 className="">{label}</h6>
                        <p className=" mb-0">
                          {label === "Phone Number" && <span>{getCountryFlag(value)}</span>} {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row dashCard mb-3">
          <div className="col-12">
            <h2 className="mainTitle">Booking Logs</h2>
          </div>
          <div className="col-12">
            <CustomTable
              filters={filters}
              setFilters={setFilters}
              loading={isSubmitting}
              headers={bookingsLogsHeaders}
              pagination={pagination}
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
                  <tr key={item?.id}>
                    <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                    <td>{item?.booking_id}</td>
                    <td>{item?.booking_type}</td>
                    <td>{item?.booking_date}</td>
                    <td>{item?.amount}</td>
                    <td
                      style={{
                        color: item.status === "Pending" ? "#FDB332" : item.status === "Upcoming" ? "#FF5C5C" : item.status === "Past" ? "#999999" : "#4CD964",
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
              filters={filters}
              setFilters={setFilters}
              loading={isSubmitting}
              headers={challengeLogsHeaders}
              pagination={pagination}
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
                    <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                    <td>{item?.challenge_title}</td>
                    <td>{item?.challenge_type}</td>
                    <td>{item?.start_date}</td>
                    <td
                      style={{
                        color: item.status === "On Going" ? "#FDB332" : item.status === "Failed" ? "#FF5C5C" : item.status === "Completed" ? "#4CD964" : "",
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
              filters={filters}
              setFilters={setFilters}
              loading={isSubmitting}
              headers={subscriptionLogsHeaders}
              pagination={pagination}
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
                  options: activeExpiredStatus,
                },
              ]}
            >
              <tbody>
                {subscriptionLogs?.map((item, index) => (
                  <tr key={item?.id}>
                    <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                    <td>{item?.subscription_title}</td>
                    <td>{item?.subscription_duration}</td>
                    <td>{item?.total_payment}</td>
                    <td>{item?.payment_date}</td>
                    <td>{item?.expiry_date}</td>
                    <td
                      style={{
                        color: item.status === "Active" ? "#4CD964" : item.status === "Expired" ? "#FF5C5C" : "",
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
