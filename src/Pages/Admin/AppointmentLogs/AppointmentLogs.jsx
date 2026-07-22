import { useEffect, useMemo, useState } from "react";
import CustomTable from "../../../Components/CustomTable";
import { appointmentLogsHeaders } from "../../../Config/TableHeaders";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../../Services/Api";
import { usePagination } from "../../../Hooks/usePagination";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { getBookingLocalDate } from "../../../Utils/timezone";
import { userBookingLogsData } from "../../../Config/data";
import "./style.css";

const TYPE_TABS = [
  { label: "Doctor", value: "doctor" },
  { label: "Trainer", value: "trainer" },
];

const STATUS_TABS = [
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
  { label: "In Progress", value: "in-progress" },
  { label: "Rescheduled", value: "rescheduled" },
];

const DEFAULT_FILTERS = {
  from: "",
  to: "",
  page: 1,
  per_page: 10,
  search: "",
  type: TYPE_TABS[0].value,
  status: STATUS_TABS[0].value,
};

const extractResponsePayload = (response) => {
  if (!response) {
    return { data: [], meta: {} };
  }

  if (Array.isArray(response?.data)) {
    return { data: response.data, meta: response.meta ?? {} };
  }

  if (Array.isArray(response?.detail?.data)) {
    return { data: response.detail.data, meta: response.detail };
  }

  if (Array.isArray(response?.data?.data)) {
    const metaSource = response.data.meta ?? response.data;
    return { data: response.data.data, meta: metaSource };
  }

  return { data: [], meta: {} };
};

const hasFiltersChanged = (prev, next) => {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  for (const key of keys) {
    if (prev[key] !== next[key]) {
      return true;
    }
  }

  return false;
};

const AppointmentLogs = () => {
  const navigate = useNavigate();
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);
  const [refreshTick, setRefreshTick] = useState(0);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, updatePagination] = usePagination(
    DEFAULT_FILTERS.page,
    DEFAULT_FILTERS.per_page,
  );

  useEffect(() => {
    updatePagination({ perPage: filters.per_page });
  }, [filters.per_page, updatePagination]);

  const updateFilters = (updates) => {
    if (typeof updates === "function") {
      setFiltersState((prev) => {
        const next = updates(prev);
        if (!next) {
          return prev;
        }

        return hasFiltersChanged(prev, next) ? next : prev;
      });
      return;
    }

    setFiltersState((prev) => {
      const next = { ...prev, ...updates };
      const shouldResetPage =
        (updates.search !== undefined && updates.search !== prev.search) ||
        (updates.per_page !== undefined &&
          updates.per_page !== prev.per_page) ||
        (updates.from !== undefined && updates.from !== prev.from) ||
        (updates.to !== undefined && updates.to !== prev.to);

      if (shouldResetPage) {
        next.page = 1;
      }

      return hasFiltersChanged(prev, next) ? next : prev;
    });
  };

  const handleTableFiltersChange = (updates) => {
    if (typeof updates === "function") {
      updateFilters(updates);
      return;
    }

    const updateKeys = Object.keys(updates || {});
    const isClearAction =
      updateKeys.length === 2 &&
      updateKeys.includes("page") &&
      updateKeys.includes("per_page");

    if (isClearAction) {
      const clearedFilterValues = {
        page: 1,
        per_page: 10,
        search: "",
        from: "",
        to: "",
      };

      const nextFilters = { ...filters, ...clearedFilterValues };
      if (!hasFiltersChanged(filters, nextFilters)) {
        setRefreshTick((prev) => prev + 1);
      }

      updateFilters(clearedFilterValues);
      return;
    }

    updateFilters(updates);
  };

  useEffect(() => {
    const applyDataset = ({ data, meta }) => {
      const rows = data ?? [];
      const total = Number(meta?.total ?? rows.length ?? 0);
      const perPage = Number(meta?.per_page ?? filters.per_page ?? 10);
      const currentPage = Number(meta?.current_page ?? filters.page ?? 1);
      const showData = Number(
        meta?.to ?? Math.min(total, currentPage * perPage),
      );
      const totalPages = Math.max(
        1,
        Number((meta?.last_page ?? Math.ceil(total / perPage)) || 1),
      );

      setRecords(rows);
      updatePagination({
        showData,
        currentPage,
        totalRecords: total,
        totalPages,
        perPage,
      });
    };

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const params = { ...filters };

        if (!params.search) {
          delete params.search;
        }

        if (!params.from) {
          delete params.from;
        }

        if (!params.to) {
          delete params.to;
        }

        const response = await getAll(`/appointments/all-bookings`, params);
        let dataset = extractResponsePayload(response);

        if (
          (!dataset.data || dataset.data.length === 0) &&
          userBookingLogsData?.detail?.data?.length
        ) {
          // dataset = extractResponsePayload(userBookingLogsData);
        }

        applyDataset(dataset);
      } catch (error) {
        console.error("Error fetching booking logs:", error);
        if (userBookingLogsData?.detail?.data?.length) {
          applyDataset(extractResponsePayload(userBookingLogsData));
        } else {
          applyDataset({ data: [], meta: {} });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filters, refreshTick, updatePagination]);

  const handleTypeChange = (value) => {
    if (filters.type === value) return;
    updateFilters({ type: value, page: 1 });
  };

  const handleStatusChange = (value) => {
    if (filters.status === value) return;
    updateFilters({ status: value, page: 1 });
  };

  const startIndex = useMemo(() => {
    const perPage = pagination.perPage || filters.per_page || 10;
    const currentPage = pagination.currentPage || filters.page || 1;
    return (currentPage - 1) * perPage;
  }, [pagination, filters]);

  const tableRows = useMemo(
    () =>
      records.map((item, index) => {
        const bookingId = item?.booking_id ?? item?.bookingId ?? "-";
        const userName =
          [
            item?.first_name,
            item?.last_name,
            item?.user?.first_name,
            item?.user?.last_name,
          ]
            .filter(Boolean)
            .join(" ") ||
          item?.user?.name ||
          item?.user_name ||
          item?.userName ||
          "-";

        const serviceCategory =
          item?.service?.title ||
          item?.service_category ||
          item?.category ||
          "-";

        const providerName =
          [
            item?.service?.user?.first_name,
            item?.service?.user?.last_name,
            item?.provider?.first_name,
            item?.provider?.last_name,
            item?.consultant?.first_name,
            item?.consultant?.last_name,
          ]
            .filter(Boolean)
            .join(" ") ||
          item?.service?.user?.name ||
          item?.provider?.name ||
          item?.consultant?.name ||
          item?.service_provider_name ||
          item?.service_provider ||
          item?.doctor_name ||
          item?.trainer_name ||
          "-";

        const bookingDate = getBookingLocalDate(item);

        const charges =
          item?.amount_paid ||
          item?.amount ||
          item?.charges ||
          item?.service?.charges ||
          "-";

        return {
          key: item?.id ?? `${bookingId}-${index}`,
          appointmentId: item?.id,
          index: serialNum(startIndex + index + 1),
          bookingId,
          userName,
          serviceCategory,
          providerName,
          bookingDate,
          charges,
          paymentType: item?.payment_type,
        };
      }),
    [records, startIndex],
  );

  const hasRecords = tableRows.length > 0;

  return (
    <DashboardLayout pageTitle="Appointment Logs">
      <div className="container-fluid">
        <div className="dashCard booking-logs-card">
          <h2 className="mainTitle mb-4">Booking Logs</h2>

          <div className="d-flex flex-wrap gap-2 mb-4 logs-type-group">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`btn min-width-120 ${filters.type === tab.value ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handleTypeChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4 logs-status-group">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`btn min-width-120 ${filters.status === tab.value ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handleStatusChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <CustomTable
            filters={filters}
            setFilters={handleTableFiltersChange}
            loading={loading}
            headers={appointmentLogsHeaders}
            pagination={pagination}
            dateFilters={[
              {
                title: "Appointment Date",
                from: "from",
                to: "to",
                fromTitle: "From",
                toTitle: "To",
              },
            ]}
          >
            <tbody>
              {hasRecords ? (
                tableRows.map((row) => (
                  <tr
                    key={row.key}
                    {...(row.appointmentId
                      ? clickableTableRowNavProps(
                          navigate,
                          `/admin/appointments/${row.appointmentId}`,
                        )
                      : {})}
                  >
                    <td>{row.index}</td>
                    <td>#{row.appointmentId}</td>
                    <td>{row.userName}</td>
                    <td>{row.serviceCategory}</td>
                    <td>{row.providerName}</td>
                    <td>{row.bookingDate}</td>
                    <td>
                      {" "}
                      {row.paymentType === "subscription_included"
                        ? `Included in Plan`
                        : `${row.charges} Yalla Coins` || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={appointmentLogsHeaders.length}
                    className="text-center"
                  >
                    No booking logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </CustomTable>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentLogs;
