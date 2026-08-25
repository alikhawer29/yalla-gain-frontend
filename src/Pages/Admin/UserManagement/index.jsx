import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import { userHeaders } from "../../../Config/TableHeaders";
import { normalStatus, statusOptions } from "../../../Config/TableStatus";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import "./style.css";
import { getAll, post } from "../../../Services/Api";

/** API may return 1, "1", true for active — note: string "0" is truthy in JS. */
const isRowActiveStatus = (status) =>
  status === 1 || status === true || status === "1";

/** Omit All/empty status so the API returns every user, not Inactive. */
const toUserListParams = (filters) => {
  const params = { ...filters };
  if (!params.status || params.status === "all") delete params.status;
  return params;
};

const UserManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const navigate = useNavigate();
  const [statusLoading, setStatusLoading] = useState({});
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getAll(`/users`, toUserListParams(filters)),
  });

  // Update pagination when data changes
  useEffect(() => {
    if (usersResponse?.status) {
      const { data } = usersResponse;
      const { total, per_page, current_page, to } = usersResponse.meta;
      updatePagination({
        showData: to,
        currentPage: current_page,
        totalRecords: total,
        totalPages: Math.ceil(total / per_page),
      });
    }
  }, [usersResponse, updatePagination]);

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }) => post(`/user/${userId}/status`, { status }),
    onMutate: async ({ userId }) => {
      setStatusLoading(prev => ({ ...prev, [userId]: true }));
    },
    onSuccess: (response, variables) => {
      if (response.status) {
        // Optimistically update the cache
        queryClient.setQueryData(['users', filters], (oldData) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map(user =>
              user.id === variables.userId ? { ...user, status: variables.status } : user
            )
          };
        });
        
        showModal(
          null,
          `User status has been changed to ${
            variables.status === "1" ? "Active" : "Inactive"
          } successfully.`,
          null,
          true,
        );
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    },
    onError: (error, variables) => {
      console.error("Error updating user status:", error);
      showModal(
        null,
        `Failed to update user status: ${error.message}`,
        null,
        true,
      );
      // Refetch data on error
      refetch();
    },
    onSettled: (_, __, variables) => {
      setStatusLoading(prev => ({ ...prev, [variables.userId]: false }));
    },
  });

  const handleStatusChange = useCallback((e, userId) => {
    const newStatusValue = e;
    showModal(
      null,
      `Are you sure you want to change this user's status to ${
        newStatusValue === "1" ? "Active" : "Inactive"
      }?`,
      () => onConfirmStatusChange(userId, newStatusValue),
    );
  }, [showModal]);

  const onConfirmStatusChange = (userId, newStatusValue) => {
    statusMutation.mutate({ userId, status: newStatusValue });
  };

  const memoizedUserData = useMemo(() => usersResponse?.data || [], [usersResponse]);

  // Handle query errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching users:", error);
    }
  }, [error]);

  return (
    <DashboardLayout pageTitle="User Management">
      <div className="container-fluid">
        <div className="dashCard">
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
                    loading={isLoading}
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
                      {memoizedUserData?.map((item, index) => (
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
                              className={`tabel-select status${isRowActiveStatus(item?.status) ? "1" : "0"}`}
                              required
                              id={`status${item?.id}`}
                              name="status"
                              value={isRowActiveStatus(item?.status) ? "1" : "0"}
                              onChange={(e) => handleStatusChange(e, item?.id)}
                              isInputNeeded={false}
                              disabled={statusLoading[item?.id]}
                            >
                              {statusOptions}
                            </Select>
                            {statusLoading[item?.id] && (
                              <span className="status-loading">Updating...</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </CustomTable>
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
