import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { serialNum } from "../../../Utils/helper";
import { doctorManagementHeaders } from "../../../Config/TableHeaders";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getAll, post } from "../../../Services/Api";
import "./style.css";

const TrainerManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const trainerHeaders = useMemo(
    () =>
      doctorManagementHeaders.map((header) =>
        header.key === "name" ? { ...header, title: "Trainer Name" } : header,
      ),
    [],
  );

  const apiFilters = useMemo(() => {
    const { search, page, per_page, status, fromDate, toDate, from, to } =
      filters;
    const normalizedStatus = status === "" ? "" : String(status);
    return {
      search: search || "",
      page: page || 1,
      per_page: per_page || 10,
      status: normalizedStatus,
      from: from ?? fromDate ?? "",
      to: to ?? toDate ?? "",
      type: "trainer",
    };
  }, [filters]);

  const fetchTrainers = async () => {
    try {
      startSubmitting(true);
      const params = { ...apiFilters };
      if (!params.status) delete params.status;
      if (!params.from) delete params.from;
      if (!params.to) delete params.to;
      const response = await getAll(`/doctors`, params);
      if (response?.status) {
        const data = response?.data || [];
        const meta = response?.meta || {};
        setRows(data);
        const total = meta?.total ?? data.length ?? 0;
        const perPage = meta?.per_page ?? Number(filters?.per_page || 10);
        const currentPage = meta?.current_page ?? Number(filters?.page || 1);
        const showData = meta?.to ?? Math.min(total, currentPage * perPage);
        updatePagination({
          showData,
          currentPage,
          totalRecords: total,
          totalPages: Math.max(1, Math.ceil(total / perPage)),
          perPage,
        });
      } else {
        setRows([]);
        updatePagination({
          showData: 0,
          currentPage: 1,
          totalRecords: 0,
          totalPages: 1,
          perPage: filters?.per_page || 10,
        });
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilters]);

  const handleStatusChange = (newStatusValue, trainerId) => {
    const statusLabel = newStatusValue === "1" ? "Active" : "Inactive";
    showModal(
      null,
      `Are you sure you want to change this trainer's status to ${statusLabel}?`,
      () => confirmStatusChange(trainerId, newStatusValue),
    );
  };

  const confirmStatusChange = async (trainerId, newStatusValue) => {
    try {
      await post(`/doctor/${trainerId}/status`, { status: newStatusValue });
      await fetchTrainers();

      showModal(
        null,
        `Trainer status has been changed to ${newStatusValue === "1" ? "Active" : "Inactive"} successfully.`,
        null,
        true,
      );
    } catch (error) {
      console.error("Error updating Trainer status:", error);
    }
  };

  const startIndex =
    (pagination.currentPage - 1) *
    (pagination.perPage || filters.per_page || 10);

  const statusFilterOptions = [{ value: "", text: "All" }, ...statusOptions];

  return (
    <DashboardLayout pageTitle="Trainer Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <h2 className="mainTitle mb-0">Trainer Management</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/trainer-management/requests")}
                >
                  New Requests
                </button>
              </div>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={trainerHeaders}
                pagination={pagination}
                selectOptions={[
                  {
                    main_title: "Filter by status",
                    title: "status",
                    options: statusFilterOptions,
                  },
                ]}
                dateFilters={[
                  {
                    title: "Date",
                    from: "from",
                    to: "to",
                    fromTitle: "From",
                    toTitle: "To",
                  },
                ]}
              >
                <tbody>
                  {rows.map((trainer, index) => {
                    const isActive = String(trainer?.status ?? "") === "1";
                    const trainerName =
                      [trainer?.first_name, trainer?.last_name]
                        .filter(Boolean)
                        .join(" ") ||
                      trainer?.name ||
                      "-";
                    return (
                      <tr key={trainer?.id ?? index}>
                        <td>{serialNum(startIndex + index + 1)}</td>
                        <td>{trainerName}</td>
                        <td>{trainer?.email || "-"}</td>
                        <td>
                          {trainer?.created_at ||
                            trainer?.registrationDate ||
                            "-"}
                        </td>
                        <td>
                          <Select
                            className={`tabel-select status${isActive ? "Active" : "Inactive"}`}
                            required
                            id={`status${trainer?.id}`}
                            name="status"
                            value={isActive ? "1" : "0"}
                            onChange={(value) =>
                              handleStatusChange(value, trainer?.id)
                            }
                            isInputNeeded={false}
                          >
                            {statusOptions}
                          </Select>
                        </td>
                        <td>
                          <Link
                            className="viewLink"
                            to={`/admin/trainer-management/${trainer?.id}`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </CustomTable>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { status: "", from: "", to: "" };
export default withModal(withFilters(TrainerManagement, additionalFilters));
