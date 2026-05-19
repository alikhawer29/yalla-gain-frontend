import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { serialNum } from "../../../Utils/helper";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import { coinManagementHeaders } from "../../../Config/TableHeaders";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { getAll, post } from "../../../Services/Api";

const CoinManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState("");

  const fetchLogs = async () => {
    try {
      startSubmitting(true);
      const res = await getAll(`/coins`, filters);
      if (res?.status) {
        const data = res?.data || [];
        const meta = res?.meta || {};
        setRows(data);
        const total = meta?.total ?? data?.length ?? 0;
        const per_page = meta?.per_page ?? Number(filters?.per_page || 10);
        const current_page = meta?.current_page ?? Number(filters?.page || 1);
        const to = meta?.to ?? Math.min(total, current_page * per_page);
        updatePagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.max(1, Math.ceil(total / per_page)),
        });
      }
    } catch (e) {
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLogs(); /* eslint-disable-next-line */
  }, [filters]);

  const submitAmount = async (e) => {
    e.preventDefault();
    if (!amount) return;
    const res = await post(`/coin`, { amount });
    if (res?.status) {
      setAmount("");
      showModal("Successfully", "Per Yalla coin amount updated", null, true);
      fetchLogs();
    } else {
      showModal("Error", res?.message ?? "Something went wrong", null, true);
    }
  };

  return (
    <DashboardLayout pageTitle="Yalla Coin Logs">
      <div className="container-fluid">
        {/* Coin amount form */}
        <div className="dashCard mb-4">
          <h2 className="mainTitle mb-3">
            <BackButton2 />
            Coin Management
          </h2>
          <form className="row" onSubmit={submitAmount}>
            <div className="col-12 col-xl-6 col-xxl-5">
              <CustomInput
                wrapperClass="mb-3"
                label="Per Yalla Coin Amount"
                placeholder="Enter amount"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <CustomButton
                type="submit"
                variant="primary"
                text="Update"
                isPending={isSubmitting}
              />
            </div>
          </form>
        </div>

        {/* Logs table */}
        <div className="dashCard">
          <h3 className="mainTitle mb-3">Set Amount Logs</h3>
          <CustomTable
            filters={filters}
            setFilters={setFilters}
            loading={isSubmitting}
            headers={coinManagementHeaders}
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
                  <td>{item?.amount ? `AED ${item.amount}` : "-"}</td>
                  <td>{item?.created_at}</td>
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
export default withModal(withFilters(CoinManagement, additionalFilters));
