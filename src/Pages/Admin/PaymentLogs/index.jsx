import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { formatSubscriptionPlanDisplayName } from "../../../Utils/subscriptionLogHelpers";
import {
  coinsCommissionLogsHeaders,
  paymentLogsBookingHeaders,
  subscriptionAdminLogsHeaders,
} from "../../../Config/TableHeaders";
import { getAll } from "../../../Services/Api";
import { getBookingLocalDate } from "../../../Utils/timezone";
import "../ReportsManagement/style.css";

const formatCommissionLogUser = (user) => {
  if (!user) return "-";
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return name || user.email || "-";
};

const formatCommissionLogType = (type) => {
  if (type === "coin_purchase") return "Coin Purchase";
  if (type === "coin_transfer") return "Coin Transfer";
  return type || "-";
};

const formatCommissionLogAmount = (row) => {
  const amount = row?.amount;
  if (amount == null || amount === "") return "-";
  const currency = String(row?.amount_currency || "").toLowerCase();
  if (currency === "aed") return `AED ${Number(amount).toFixed(2)}`;
  if (currency === "coins") return `${amount} Yalla Coins`;
  return row?.amount_currency
    ? `${amount} ${row.amount_currency}`
    : String(amount);
};

const formatCommissionLogCoins = (row) => {
  if (row?.type === "coin_purchase") {
    const coins = row?.coins_purchased ?? row?.gross_coins;
    return coins != null ? `${coins} Yalla Coins` : "-";
  }
  if (row?.type === "coin_transfer") {
    const parts = [];
    if (row?.transfer_amount != null) {
      parts.push(`Transfer: ${row.transfer_amount}`);
    }
    if (row?.total_deducted != null) {
      parts.push(`Deducted: ${row.total_deducted}`);
    }
    return parts.length ? parts.join(" | ") : "-";
  }
  return "-";
};

const formatCommissionLogCommission = (commission) =>
  commission != null && commission !== "" ? `${commission} AED` : "-";

const formatCommissionLogPercentage = (value) =>
  value != null && value !== "" ? `${value}%` : "-";

const seedDoctorTrainer = () => {
  // Static rows as per design: S.No, Booking ID, Booking Charges, Commission, Booking Date
  const base = [
    {
      id: 1,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
    {
      id: 2,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
    {
      id: 3,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
    {
      id: 4,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
    {
      id: 5,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
    {
      id: 6,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
    {
      id: 7,
      booking_id: "#12453",
      charges: "250 Yalla Coins",
      commission: "25 Yalla Coins",
      date: "12/03/2024",
    },
  ];
  return base;
};

// (Kept for potential fallback/testing)
const seedSubscriptions = () => [];

const tabs = [
  { key: "doctor", label: "Doctor" },
  { key: "trainer", label: "Trainer" },
  { key: "subscription", label: "Subscription" },
  { key: "coins_commission", label: "Coins Commission" },
];

const PaymentLogs = ({ filters, setFilters, pagination, updatePagination }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("doctor");
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const allRows = useMemo(() => {
    if (activeTab === "subscription") return seedSubscriptions();
    return seedDoctorTrainer();
  }, [activeTab]);

  useEffect(() => {
    const run = async () => {
      if (activeTab === "coins_commission") {
        try {
          startSubmitting();
          const params = {
            page: filters?.page,
            per_page: filters?.per_page,
            search: filters?.search || "",
            from: filters?.from || "",
            to: filters?.to || "",
          };
          const res = await getAll(`/commission-logs`, params);
          const data = Array.isArray(res?.data) ? res.data : [];
          const normalized = data.map((r, idx) => ({
            id: r?.id ?? idx,
            type: formatCommissionLogType(r?.type),
            date: r?.date ?? r?.created_at ?? "-",
            user: formatCommissionLogUser(r?.user),
            recipient: formatCommissionLogUser(r?.recipient),
            amount: formatCommissionLogAmount(r),
            coins: formatCommissionLogCoins(r),
            commission: formatCommissionLogCommission(r?.commission_aed),
            commission_percentage: formatCommissionLogPercentage(
              r?.commission_percentage,
            ),
          }));
          setRows(normalized);

          const meta = res?.meta ?? {};
          const total = Number(meta?.total ?? normalized.length ?? 0);
          const perPage = Number(meta?.per_page ?? filters?.per_page ?? 10);
          const currentPage = Number(meta?.current_page ?? filters?.page ?? 1);
          const to = Number(meta?.to ?? Math.min(total, currentPage * perPage));
          updatePagination({
            showData: to,
            currentPage,
            totalRecords: total,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
          });
        } catch (e) {
          setRows([]);
          updatePagination({
            showData: 0,
            currentPage: 1,
            totalRecords: 0,
            totalPages: 1,
          });
        } finally {
          stopSubmitting();
        }
        return;
      }

      if (activeTab === "subscription") {
        try {
          startSubmitting();
          const params = {
            page: filters?.page,
            per_page: filters?.per_page,
            search: filters?.search || "",
            from: filters?.from || "",
            to: filters?.to || "",
          };
          const res = await getAll(`/subscription-logs`, params);
          const data = Array.isArray(res?.data) ? res.data : [];
          const normalized = data.map((r, idx) => ({
            id: r?.id ?? idx,
            name: `${r?.user?.first_name ?? ""} ${r?.user?.last_name ?? ""}`.trim(),
            email: r?.user?.email ?? "-",
            plan: formatSubscriptionPlanDisplayName(r),
            active: !!r?.is_active,
            price: `${r?.price_paid ?? r?.subscription_plan?.price ?? "-"} Yalla Coins`,
            purchase: r?.subscribed_on ?? "-",
            expiry: r?.expired_on ?? "-",
            planDuration: r?.subscription_plan?.duration ?? "-",
            is_trial: r?.is_trial ?? false,
          }));
          setRows(normalized);

          const meta = res?.meta ?? {};
          const total = Number(meta?.total ?? normalized.length ?? 0);
          const perPage = Number(meta?.per_page ?? filters?.per_page ?? 10);
          const currentPage = Number(meta?.current_page ?? filters?.page ?? 1);
          const to = Number(meta?.to ?? Math.min(total, currentPage * perPage));
          updatePagination({
            showData: to,
            currentPage,
            totalRecords: total,
            totalPages: Math.max(1, Math.ceil(total / perPage)),
          });
        } catch (e) {
          setRows([]);
          updatePagination({
            showData: 0,
            currentPage: 1,
            totalRecords: 0,
            totalPages: 1,
          });
        } finally {
          stopSubmitting();
        }
        return; // handled subscription
      }

      try {
        startSubmitting();
        const params = {
          page: filters?.page,
          per_page: filters?.per_page,
          search: filters?.search || "",
          from: filters?.from || "",
          to: filters?.to || "",
          type: activeTab, // doctor | trainer
        };
        const res = await getAll(`/appointments/all-bookings`, params);
        const data = Array.isArray(res?.data) ? res.data : [];

        // Normalize for view
        const normalized = data.map((r, idx) => ({
          id: r?.id ?? idx,
          appointmentId: r?.id ?? null,
          booking_id: r?.booking_id ?? "-",
          charges: `${r?.amount_paid ?? r?.service?.charges ?? "-"} Yalla Coins`,
          commission: `${r?.commission ?? "-"} Yalla Coins`,
          commission_aed: `${r?.commission_aed ?? "-"} AED`,
          commission_percentage: `${r?.commission_percentage ?? "-"} %`,
          date: getBookingLocalDate(r),
          isPaid:
            typeof r?.is_paid === "boolean"
              ? r.is_paid
                ? "Yes"
                : "No"
              : r?.is_paid
                ? "Yes"
                : "No",
        }));
        setRows(normalized);

        const meta = res?.meta ?? {};
        const total = Number(meta?.total ?? normalized.length ?? 0);
        const perPage = Number(meta?.per_page ?? filters?.per_page ?? 10);
        const currentPage = Number(meta?.current_page ?? filters?.page ?? 1);
        const to = Number(meta?.to ?? Math.min(total, currentPage * perPage));
        updatePagination({
          showData: to,
          currentPage,
          totalRecords: total,
          totalPages: Math.max(1, Math.ceil(total / perPage)),
        });
      } catch (e) {
        setRows([]);
        updatePagination({
          showData: 0,
          currentPage: 1,
          totalRecords: 0,
          totalPages: 1,
        });
        // Silently fail on UI
      } finally {
        stopSubmitting();
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters, allRows]);

  return (
    <DashboardLayout pageTitle="Payment Logs">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">Payment Logs</h2>

              <div className="d-flex flex-wrap gap-2 mb-4 logs-type-group">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    className={`btn min-width-120 ${activeTab === t.key ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => {
                      setActiveTab(t.key);
                      setFilters((prev) => ({ ...prev, page: 1 }));
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={
                  activeTab === "subscription"
                    ? subscriptionAdminLogsHeaders
                    : activeTab === "coins_commission"
                      ? coinsCommissionLogsHeaders
                      : paymentLogsBookingHeaders
                }
                pagination={pagination}
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
                  {activeTab === "coins_commission"
                    ? rows.map((item, index) => (
                        <tr key={`commission-${item.id ?? index}`}>
                          <td>
                            {serialNum(
                              (filters.page - 1) * filters.per_page + index + 1,
                            )}
                          </td>
                          <td>{item.type}</td>
                          <td>{item.date}</td>
                          <td>{item.user}</td>
                          {/* <td>{item.recipient}</td> */}
                          <td>{item.amount}</td>
                          <td>{item.coins}</td>
                          <td>{item.commission}</td>
                          <td>{item.commission_percentage}</td>
                        </tr>
                      ))
                    : activeTab !== "subscription"
                      ? rows.map((item, index) => (
                          <tr
                            key={`${activeTab}-${index}`}
                            {...(item.appointmentId
                              ? clickableTableRowNavProps(
                                  navigate,
                                  `/admin/appointments/${item.appointmentId}`,
                                )
                              : {})}
                          >
                            <td>
                              {serialNum(
                                (filters.page - 1) * filters.per_page +
                                  index +
                                  1,
                              )}
                            </td>
                            <td>#{item.appointmentId}</td>
                            <td>{item.charges}</td>
                            <td>{item.commission}</td>
                            <td>{item.commission_aed}</td>
                            <td>{item.commission_percentage}</td>
                            <td>{item.date}</td>
                            <td>{item.isPaid}</td>
                          </tr>
                        ))
                      : rows.map((item, index) => (
                          <tr key={`sub-${index}`}>
                            <td>
                              {serialNum(
                                (filters.page - 1) * filters.per_page +
                                  index +
                                  1,
                              )}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>
                              {item.plan}
                              {item.is_trial ? null : ` - ${item.planDuration}`}
                            </td>
                            <td
                              style={{
                                color: item.active ? "#4CD964" : "#FF5C5C",
                              }}
                            >
                              {item.active ? "Active" : "Expired"}
                            </td>
                            <td>{item.price}</td>
                            <td>{item.purchase}</td>
                            <td>{item.expiry}</td>
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

const additionalFilters = { from: "", to: "" };
export default withFilters(PaymentLogs, additionalFilters);
