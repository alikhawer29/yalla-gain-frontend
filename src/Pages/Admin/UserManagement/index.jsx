import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import { userManagementData } from "../../../Config/data";
import { userHeaders } from "../../../Config/TableHeaders"; // Table Headers
import { normalStatus, statusOptions } from "../../../Config/TableStatus"; // Import statusOptions
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import "./style.css";
import { getAll, post } from "../../../Services/Api";

const UserManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const fetchUsers = async () => {
    try {
      startSubmitting(true);
      // const response = userManagementData;
      const response = await getAll(`/users`, filters);

      if (response.status) {
        const { data } = response;
        const { total, per_page, current_page, to } = response.meta;
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

  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    showModal(
      null,
      `Are you sure you want to change this user's status to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      }?`,
      () => onConfirmStatusChange(userId, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (userId, newStatusValue) => {
    const response = await post(`/user/${userId}/status`);
    // setUserData((prevData) =>
    //     prevData.map((user) =>
    //         user.id == userId ? { ...user, status: newStatusValue } : user
    //     )
    // );
    fetchUsers();
    showModal(
      null,
      `User status has been changed to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      } successfully.`,
      null,
      true,
    );
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
                        from: "from",
                        to: "to",
                        fromTitle: "From",
                        toTitle: "To",
                      },
                    ]}
                    selectOptions={[
                      {
                        main_title: "Filter by status",
                        title: "status",
                        options: normalStatus,
                      },
                    ]}
                  >
                    <tbody>
                      {userData?.map((item, index) => (
                        <tr
                          key={item?.id}
                          {...clickableTableRowNavProps(
                            navigate,
                            String(item.id),
                          )}
                        >
                          <td>
                            {serialNum(
                              (filters.page - 1) * filters.per_page + index + 1,
                            )}
                          </td>
                          <td>
                            {item?.first_name} {item?.last_name}
                          </td>
                          <td>{item?.email}</td>
                          <td>{item?.created_at}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <Select
                              className={`tabel-select status${item?.status ? "Active" : "Inactive"}`}
                              required
                              id={`status${item?.id}`}
                              name="status"
                              value={item?.status ? "1" : "0"}
                              onChange={(e) => handleStatusChange(e, item?.id)}
                              isInputNeeded={false}
                            >
                              {statusOptions}
                            </Select>
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
