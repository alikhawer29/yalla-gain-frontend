import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { doctorManagementHeaders } from "../../../Config/TableHeaders";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getAll, post } from "../../../Services/Api";
import "./style.css";

const DoctorManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

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
      type: "doctor",
    };
  }, [filters]);

  const fetchDoctors = async () => {
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
      console.error("Error fetching doctors:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilters]);

  const handleStatusChange = (newStatusValue, doctorId) => {
    const statusLabel = newStatusValue === "1" ? "Active" : "Inactive";
    showModal(
      null,
      `Are you sure you want to change this doctor's status to ${statusLabel}?`,
      () => confirmStatusChange(doctorId, newStatusValue),
    );
  };

  const confirmStatusChange = async (doctorId, newStatusValue) => {
    try {
      await post(`/doctor/${doctorId}/status`, { status: newStatusValue });
      await fetchDoctors();

      showModal(
        null,
        `Doctor status has been changed to ${newStatusValue === "1" ? "Active" : "Inactive"} successfully.`,
        null,
        true,
      );
    } catch (error) {
      console.error("Error updating doctor status:", error);
    }
  };

  const startIndex =
    (pagination.currentPage - 1) *
    (pagination.perPage || filters.per_page || 10);

  const statusFilterOptions = [{ value: "", text: "All" }, ...statusOptions];

  return (
    <DashboardLayout pageTitle="Doctor Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <h2 className="mainTitle mb-0">Doctor Management</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/doctor-management/requests")}
                >
                  New Requests
                </button>
              </div>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={doctorManagementHeaders}
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
                  {rows.map((doctor, index) => {
                    const isActive = String(doctor?.status ?? "") === "1";
                    const doctorName =
                      [doctor?.first_name, doctor?.last_name]
                        .filter(Boolean)
                        .join(" ") ||
                      doctor?.name ||
                      "-";
                    return (
                      <tr
                        key={doctor?.id ?? index}
                        {...clickableTableRowNavProps(
                          navigate,
                          `/admin/doctor-management/${doctor?.id}`,
                        )}
                      >
                        <td>{serialNum(startIndex + index + 1)}</td>
                        <td>{doctorName}</td>
                        <td>{doctor?.email || "-"}</td>
                        <td>
                          {doctor?.created_at ||
                            doctor?.registrationDate ||
                            "-"}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Select
                            className={`tabel-select status${isActive ? "1" : "0"}`}
                            required
                            id={`status${doctor?.id}`}
                            name="status"
                            value={isActive ? "1" : "0"}
                            onChange={(value) =>
                              handleStatusChange(value, doctor?.id)
                            }
                            isInputNeeded={false}
                          >
                            {statusOptions}
                          </Select>
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
export default withModal(withFilters(DoctorManagement, additionalFilters));
