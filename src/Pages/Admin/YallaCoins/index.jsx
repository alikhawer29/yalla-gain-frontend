import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { serialNum } from "../../../Utils/helper";
import { inAppCoinHeaders } from "../../../Config/TableHeaders";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../../Services/Api";

// API endpoint for coin logs
const COIN_LOGS_ROUTE = "/coin-logs";

/** Base purchase amount in AED (excludes transaction commission). */
const formatBasePrice = (item) => {
  const amountPaid = Number(item?.amount_paid);
  const totalCharge = Number(item?.total_charge_aed);
  const commissionAed = Number(item?.commission_aed);

  let base = Number.isFinite(amountPaid) ? amountPaid : 0;

  // Older rows may have stored the card total in amount_paid; recover the base.
  if (
    Number.isFinite(totalCharge) &&
    Number.isFinite(commissionAed) &&
    Math.abs(amountPaid - totalCharge) < 0.01 &&
    commissionAed > 0
  ) {
    base = Math.max(0, totalCharge - commissionAed);
  }

  return `AED ${base.toFixed(2).replace(/\.00$/, "")}`;
};

const InAppCoinManagement = ({
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      startSubmitting(true);
      try {
        const params = {
          page: filters.page,
          per_page: filters.per_page,
          search: filters.search || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
        };
        const res = await getAll(COIN_LOGS_ROUTE, params);
        const list = (res?.data || []).map((item) => ({
          id: item?.id,
          full_name:
            `${item?.user?.first_name ?? ""} ${item?.user?.last_name ?? ""}`.trim() ||
            "-",
          email: item?.user?.email ?? "-",
          coins: item?.coins ?? 0,
          price: formatBasePrice(item),
          purchase_date: item?.created_at ?? "-",
        }));

        setRows(list);

        const meta = res?.meta || {};
        updatePagination({
          showData: list.length,
          currentPage: meta.current_page || filters.page,
          totalRecords: meta.total ?? list.length,
          totalPages: meta.last_page || 1,
          perPage: meta.per_page || filters.per_page,
        });
      } catch (e) {
        setRows([]);
        updatePagination({
          showData: 0,
          currentPage: filters.page,
          totalRecords: 0,
          totalPages: 1,
        });
      } finally {
        stopSubmitting(false);
      }
    };
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.page,
    filters.per_page,
    filters.search,
    filters.from,
    filters.to,
  ]);

  const navigate = useNavigate();

  return (
    <DashboardLayout pageTitle="Yalla Coin Logs">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="mainTitle mb-0">Yalla Coin Logs</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/yalla-coins/manage`)}
            >
              Coin Management
            </button>
          </div>
          <CustomTable
            filters={filters}
            setFilters={setFilters}
            loading={isSubmitting}
            headers={inAppCoinHeaders}
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
              {rows.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    {serialNum(
                      (filters.page - 1) * filters.per_page + index + 1,
                    )}
                  </td>
                  <td>{item?.full_name}</td>
                  <td>{item?.email}</td>
                  <td>{item?.coins}</td>
                  <td>{item?.price}</td>
                  <td>{item?.purchase_date}</td>
                </tr>
              ))}
            </tbody>
          </CustomTable>
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { from: "", to: "" };
export default withFilters(InAppCoinManagement, additionalFilters);
