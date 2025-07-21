import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import { userManagementData } from "../../../Config/data";
import { userHeaders } from "../../../Config/TableHeaders"; // Table Headers
import { normalStatus, statusOptions } from "../../../Config/TableStatus"; // Import statusOptions
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { dateFormat, serialNum } from "../../../Utils/helper";
import "./style.css";

const UserManagement = ({ showModal, filters, setFilters, pagination, updatePagination }) => {
  const [userData, setUserData] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const fetchUsers = async () => {
    try {
      startSubmitting(true);
      const response = userManagementData;
      if (response.status) {
        const { data, total, per_page, current_page, to } = response.detail;
        setUserData(data);
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
    // Update the status in the userData state
    setUserData((prevData) => prevData.map((user) => (user.id === userId ? { ...user, status_detail: newStatusValue } : user)));
    showModal("", `User status has been changed to ${newStatusValue === "1" ? "Active" : "Inactive"} successfully.`, null, true);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return (
    <DashboardLayout pageTitle="User Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="row mb-2">
                <div className="col-12">
                  <h2 className="mainTitle mb-0">User Management</h2>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <CustomTable
                    filters={filters}
                    setFilters={setFilters}
                    loading={isSubmitting}
                    headers={userHeaders}
                    pagination={pagination}
                    dateFilters={[
                      {
                        title: "Registration Date",
                        from: "fromDate",
                        to: "toDate",
                        fromTitle: "From",
                        toTitle: "To",
                      },
                    ]}
                    selectOptions={[
                      {
                        main_title: "Filter by status",
                        title: "Status",
                        options: normalStatus,
                      },
                    ]}
                  >
                    <tbody>
                      {userData?.map((item, index) => (
                        <tr key={item?.id}>
                          <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                          <td>{item?.first_name}</td>
                          <td>{item?.last_name}</td>
                          <td>{item?.email}</td>
                          <td>{dateFormat(item?.created_at)}</td>
                          {/* Status column with Select dropdown */}
                          <td>
                            <Select
                              className={`tabel-select status${item?.status_detail}`}
                              required
                              id={`status${item?.id}`}
                              name="status"
                              value={item?.status_detail}
                              onChange={(e) => handleStatusChange(e, item?.id)}
                              isInputNeeded={false}
                            >
                              {statusOptions}
                            </Select>
                          </td>
                          <td>
                            <div className="d-flex cp gap-3 tableAction align-items-center justify-content-center">
                              <span className="tooltip-toggle" aria-label="View">
                                <Link to={`${item.id}`}>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
// Additional Filters
const additionalFilters = {
  expiryFromDate: "",
  expiryToDate: "",
};

export default withModal(withFilters(UserManagement, additionalFilters));
