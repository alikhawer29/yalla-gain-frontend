import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { doctorRequestsHeaders } from "../../../Config/TableHeaders";
import withFilters from "../../../HOC/withFilters";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getAll } from "../../../Services/Api";
import "./style.css";

const getStatusMap = (t) => ({
  1: t("request_status.approved"),
  2: t("request_status.pending"),
  3: t("request_status.rejected"),
});

const getStatusFilterOptions = (t) => [
  { value: "", text: t("status.all") },
  { value: "2", text: t("request_status.pending") },
  { value: "1", text: t("request_status.approved") },
  { value: "3", text: t("request_status.rejected") },
];

const DoctorRequests = ({
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const apiFilters = useMemo(() => {
    const { search, page, per_page, status, from, to, fromDate, toDate } =
      filters;
    return {
      search: search || "",
      page: page || 1,
      per_page: per_page || 10,
      status: status || "",
      from: from ?? fromDate ?? "",
      to: to ?? toDate ?? "",
      type: "doctor",
    };
  }, [filters]);

  const fetchRequests = async () => {
    try {
      startSubmitting(true);
      const params = { ...apiFilters };
      if (!params.status) delete params.status;
      if (!params.from) delete params.from;
      if (!params.to) delete params.to;

      const response = await getAll(`/doctors/requests`, params);
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
      console.error("Error fetching doctor requests:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilters]);

  const startIndex =
    (pagination.currentPage - 1) *
    (pagination.perPage || filters.per_page || 10);

  return (
    <DashboardLayout pageTitle={t('pages.doctor_requests')}>
      <div className="container-fluid">
        <div className="dashCard doctor-requests-section">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <h2 className="mainTitle mb-4">
              <BackButton2 />
              {t("pages.doctor_requests")}
            </h2>
          </div>

          <CustomTable
            filters={filters}
            setFilters={setFilters}
            loading={isSubmitting}
            headers={doctorRequestsHeaders}
            pagination={pagination}
            selectOptions={[
              {
                main_title: t("filters.filter_by_status"),
                title: "status",
                options: getStatusFilterOptions(t),
              },
            ]}
            dateFilters={[
              {
                title: t("filters.date"),
                from: "from",
                to: "to",
                fromTitle: t("filters.from"),
                toTitle: t("filters.to"),
              },
            ]}
          >
            <tbody>
              {rows.map((request, index) => {
                const statusKey = String(request?.status ?? "");
                const statusLabel = getStatusMap(t)[statusKey] || "-";
                return (
                  <tr
                    key={request?.id ?? index}
                    {...clickableTableRowNavProps(
                      navigate,
                      `/admin/doctor-management/requests/${request?.id}`,
                    )}
                  >
                    <td>{serialNum(startIndex + index + 1)}</td>
                    <td>
                      {[request?.first_name, request?.last_name]
                        .filter(Boolean)
                        .join(" ") ||
                        request?.doctorName ||
                        "-"}
                    </td>
                    <td>
                      <span
                        className={`statusChip status${
                          { 1: "Approved", 2: "Pending", 3: "Rejected" }[statusKey] || ""
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td>
                      {request?.created_at || request?.requestedDate || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </CustomTable>
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { status: "", from: "", to: "" };
export default withFilters(DoctorRequests, additionalFilters);
