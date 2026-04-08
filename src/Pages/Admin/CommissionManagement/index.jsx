import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { commissionLogsHeaders } from "../../../Config/TableHeaders";
import { serialNum } from "../../../Utils/helper";
import { getAll, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import Toast, { showToast } from "../../../Components/Toast";

const CommissionManagement = ({
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const [activeType, setActiveType] = useState("doctor"); // 'doctor' | 'trainer'
  const [rate, setRate] = useState("");
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const isFirstTabMount = useRef(true);

  useEffect(() => {
    if (isFirstTabMount.current) {
      isFirstTabMount.current = false;
      return;
    }
    setRate("");
  }, [activeType]);

  const fetchLogs = async () => {
    try {
      startSubmitting(true);
      const params = { ...filters, for: activeType };
      // ensure only expected keys are sent
      const normalized = {
        page: params.page,
        per_page: params.per_page,
        search: params.search || "",
        from: params.from || "",
        to: params.to || "",
        for: params.for,
      };
      const response = await getAll(`/commissions`, normalized);
      if (response?.status) {
        const data = response?.data || [];
        setRows(data);
        // default current rate from most recent record
        // if (data?.length) setRate(String(data[0]?.commission_percentage ?? ""));

        const meta = response?.meta || {};
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
    } catch (error) {
      console.error("Error fetching commissions:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, filters]);

  const handleUpdate = async () => {
    const numeric = String(rate || "")
      .replace(/%/g, "")
      .trim();
    if (!numeric) return showToast("Please enter commission rate", "error");
    try {
      startSubmitting(true);
      const payload = { for: activeType, commission_percentage: numeric };
      const response = await post(`/commission`, payload);
      if (response?.status) {
        showToast("Commission updated successfully", "success");
        fetchLogs();
      } else {
        showToast(response?.message || "Something went wrong", "error");
      }
    } catch (e) {
      showToast("Unable to update commission", "error");
    } finally {
      stopSubmitting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Commission Management">
      <div className="container-fluid">
        {/* Management Card */}
        <div className="dashCard mb-4">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">Commission Management</h2>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  className={`btn min-width-120 ${activeType === "doctor" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setActiveType("doctor")}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  className={`btn min-width-120 ${activeType === "trainer" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setActiveType("trainer")}
                >
                  Trainer
                </button>
              </div>

              <div
                className="row g-3 align-items-end"
                style={{ maxWidth: 520 }}
              >
                <div className="col-12 col-md-8">
                  <CustomInput
                    label="Commission Rate"
                    required
                    placeholder="Enter Commission Rate"
                    name="commission_rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <CustomButton
                    onClick={handleUpdate}
                    variant="primary w-100"
                    text="Update"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Card */}
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-3">Commission Logs</h2>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={commissionLogsHeaders}
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
                      <td>{`${item?.commission_percentage} %`}</td>
                      <td>{item?.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </CustomTable>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </DashboardLayout>
  );
};

const additionalFilters = { from: "", to: "" };
export default withFilters(CommissionManagement, additionalFilters);
