import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { subscriptionPlanHeaders } from "../../../Config/TableHeaders";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { getAll, post } from "../../../Services/Api";
import BackButton2 from "../../../Components/BackButton/BackButton2";

const PlanManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      startSubmitting(true);
      const response = await getAll(`/plans`, filters);
      if (response.status) {
        const { data } = response;
        const { total, per_page, current_page, to } = response.meta;
        setRows(data);
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
    fetchPlans();
  }, [filters]);

  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    showModal(
      null,
      `Are you sure you want to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      } Plan?`,
      () => onConfirmStatusChange(userId, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (userId, newStatusValue) => {
    const response = await post(`/plan/${userId}/status`);

    // setRows((prevData) =>
    //     prevData.map((user) =>
    //         user.id == userId ? { ...user, status: newStatusValue } : user
    //     )
    // );
    fetchPlans();
    showModal(
      null,
      `Plan has been ${
        newStatusValue == "1" ? "Activeted" : "Deactivated"
      } successfully`,
      null,
      true,
    );
  };

  return (
    <DashboardLayout pageTitle="Subscription Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="row mb-2">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <h2 className="mainTitle mb-0">
                    <BackButton2 />
                    Subscription Plan Management
                  </h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/subscriptions/plans/add")}
                  >
                    Add Plan
                  </button>
                </div>
              </div>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={subscriptionPlanHeaders}
                pagination={pagination}
                dateFilters={[
                  {
                    title: "Date",
                    from: "fromDate",
                    to: "toDate",
                    fromTitle: "Created On",
                    toTitle: "Created To",
                  },
                ]}
                selectOptions={[
                  {
                    main_title: "Filter by status",
                    title: "status",
                    options: [
                      { value: "", text: "All" },
                      { value: "Active", text: "Active" },
                      { value: "Inactive", text: "Inactive" },
                    ],
                  },
                ]}
              >
                <tbody>
                  {rows.map((item, index) => (
                    <tr
                      key={item.id}
                      {...clickableTableRowNavProps(
                        navigate,
                        `/admin/subscriptions/plans/${item.id}`,
                      )}
                    >
                      <td>
                        {serialNum(
                          (filters.page - 1) * filters.per_page + index + 1,
                        )}
                      </td>
                      <td>{item?.title}</td>
                      <td>{item?.duration}</td>
                      <td>$ {item?.price}</td>
                      <td>{item?.created_at}</td>
                      <td>{item?.last_modified_on}</td>
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
    </DashboardLayout>
  );
};

const additionalFilters = {};
export default withModal(withFilters(PlanManagement, additionalFilters));
