import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
// import { getDetails } from "../../../Services/Api";
import { FaEye } from "react-icons/fa";
import { images } from "../../../Assets";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import { userAppointmentLogsData, userManagementData } from "../../../Config/data";
import { appointmentHeader } from "../../../Config/TableHeaders";
import { AppointmentType, appointmentStatus, sessionTypeStatus, statusOptions } from "../../../Config/TableStatus";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getCountryFlag, serialNum, statusClassMap } from "../../../Utils/helper";

const UserDetails = ({ showModal, filters, setFilters, pagination, updatePagination }) => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({});

  const [appointmentLogs, setAppointmentLogs] = useState([]);
  const [orderLogs, setOrderLogs] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const fetchUsers = async () => {
    try {
      startSubmitting(true);
      // const url = `/admin-api/users`;
      // const response = await getAll(url, filters);
      const response = userAppointmentLogsData;
      if (response.status) {
        const { data, total, per_page, current_page, to } = response.detail;
        setAppointmentLogs(data);
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
    fetchUsers();
  }, [filters]);

  // Handle status change
  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    // Open the modal for confirmation
    showModal(
      ``,
      `Are you sure you want to change this user status to ${newStatusValue === "1" ? "Active" : "Inactive"}?`,
      () => onConfirmStatusChange(userId, newStatusValue)
    );
  };

  // Confirm status change and update the state
  const onConfirmStatusChange = async (userId, newStatusValue) => {
    // Update the status in the appointmentLogs state
    setProfileData({ ...profileData, status_detail: newStatusValue });
    showModal("", `User status has been changed to ${newStatusValue === "1" ? "Active" : "Inactive"} successfully.`, null, true);
  };

  const { email, phone_number, first_name, last_name, date_of_birth } = profileData;
  return (
    <DashboardLayout pageTitle="User Details">
      <div className="dashCard ">
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex">
              <BackButton2 />
              <h2 className="mainTitle mb-0">User Details</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row mb-4  gap-3">
              <div className="detail-box-img">
                <img src={profileData?.UserImage ?? images.placeholder} alt="User" />
              </div>
              <div className="flex-grow-1 d-flex justify-content-start justify-content-sm-end">
                <div className="profile-status d-flex  align-items-end flex-column gap-3">
                  <div className="status-action">
                    <Select
                      className={`tabel-select status${profileData?.status_detail}`}
                      id={`status${profileData?.id}`}
                      name="status"
                      label="Status:"
                      value={profileData?.status_detail}
                      onChange={(e) => handleStatusChange(e, profileData?.id)}
                      labelclass="me-2"
                    >
                      {statusOptions}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10">
                <div className="row mb-4">
                  {[
                    { label: "First Name", value: first_name },
                    { label: "Last Name", value: last_name },
                    { label: "Email Address", value: email },
                    { label: "Date Of Birth", value: date_of_birth },
                    { label: "Phone Number", value: phone_number },
                  ].map(({ label, value }) => (
                    <div className="col-lg-4 col-md-6 mb-3" key={label}>
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
        <div className="row mb-3">
          <div className="col-12">
            <h2 className="mainTitle">appointment Logs</h2>
          </div>
          <div className="col-12">
            <CustomTable
              filters={filters}
              setFilters={setFilters}
              loading={isSubmitting}
              headers={appointmentHeader}
              pagination={pagination}
              // if you want multiple date filters
              dateFilters={[
                {
                  title: "date",
                  from: "fromDate",
                  to: "toDate",
                  fromTitle:"From",
                  toTitle:"To"
                },
              ]}
              selectOptions={[
                {
                  title: "status",
                  options: appointmentStatus,
                },
                {
                  main_title: "Filter by appointment type",
                  title: "appointment type",
                  options: AppointmentType,
                },
                {
                  main_title: "Filter by Session type",
                  title: "session type",
                  options: sessionTypeStatus,
                },
              ]}
            >
              <tbody>
                {appointmentLogs?.map((item, index) => (
                  <tr key={item?.id}>
                    <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                    <td>{item?.booking_id}</td>
                    <td>{item?.consultant_name}</td>
                    <td>{item?.booking_date}</td>
                    <td>{item?.appointment_date}</td>
                    <td>{item?.duration}</td>
                    <td className="text-capitalize">{item?.session_type}</td>
                    <td className="text-capitalize">{item?.appointment_type}</td>
                    <td>{item?.amount}</td>
                    <td className={statusClassMap[item?.status]}>{item?.status}</td>
                    <td>
                      <div className="d-flex cp gap-3 tableAction align-items-center justify-content-center">
                        <span className="tooltip-toggle" aria-label="View">
                          {/* <Link to={`/admin/appointments/${item.id}`}>
                            <FaEye size={20} color="#C5E4F6" />
                          </Link> */}
                          <Link to={``}>
                            <FaEye size={20} />
                          </Link>
                        </span>
                      </div>
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
