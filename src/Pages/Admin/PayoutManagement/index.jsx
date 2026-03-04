import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { payoutLogsHeaders } from "../../../Config/TableHeaders";
import { serialNum } from "../../../Utils/helper";
import { getAll, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import Toast, { showToast } from "../../../Components/Toast";

// Static seed data for payout logs
const seedLogs = (count = 12, date = "12/03/2024", label = "5 Days") =>
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        time: label,
        date,
    }));

const PayoutManagement = ({ filters, setFilters, pagination, updatePagination }) => {
    const [activeType, setActiveType] = useState("doctor"); // 'doctor' | 'trainer'
    const [timeValue, setTimeValue] = useState("");
    const [rows, setRows] = useState([]);
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const fetchLogs = async () => {
        try {
            startSubmitting(true);
            const params = { ...filters, for: activeType };
            const normalized = {
                page: params.page,
                per_page: params.per_page,
                search: params.search || "",
                from: params.from || "",
                to: params.to || "",
                for: params.for,
            };
            const response = await getAll(`/payouts`, normalized);
            if (response?.status) {
                const data = response?.data || [];
                setRows(data);
                // if (data?.length) setTimeValue(String(data[0]?.disbursement_days ?? ""));

                const meta = response?.meta || {};
                const total = meta?.total ?? data?.length ?? 0;
                const per_page = meta?.per_page ?? Number(filters?.per_page || 10);
                const current_page = meta?.current_page ?? Number(filters?.page || 1);
                const toVal = meta?.to ?? Math.min(total, current_page * per_page);
                updatePagination({
                    showData: toVal,
                    currentPage: current_page,
                    totalRecords: total,
                    totalPages: Math.max(1, Math.ceil(total / per_page)),
                });
            }
        } catch (error) {
            console.error("Error fetching payouts:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeType, filters]);

    const handleUpdate = async () => {
        const numeric = String(timeValue || "").replace(/[^0-9]/g, "").trim();
        if (!numeric) return showToast("Please enter disbursement days", "error");
        try {
            startSubmitting(true);
            const payload = { for: activeType, disbursement_days: numeric };
            const response = await post(`/payout`, payload);
            if (response?.status) {
                showToast("Payout updated successfully", "success");
                fetchLogs();
            } else {
                showToast(response?.message || "Something went wrong", "error");
            }
        } catch (e) {
            showToast("Unable to update payout", "error");
        } finally {
            stopSubmitting(false);
        }
    };

    return (
        <DashboardLayout pageTitle="Payout Management">
            <div className="container-fluid">
                {/* Management Card */}
                <div className="dashCard mb-4">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4">Payouts Management</h2>
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

                            <div className="row g-3 align-items-end" style={{ maxWidth: 520 }}>
                                <div className="col-12 col-md-8">
                                    <CustomInput
                                        label="Disbursement Time"
                                        required
                                        placeholder="05"
                                        name="disbursement_time"
                                        value={timeValue}
                                        onChange={(e) => setTimeValue(e.target.value)}
                                        type="text"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <CustomButton onClick={handleUpdate} variant="primary w-100" text="Update" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs Card */}
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-3">Payout Logs</h2>
                            <CustomTable
                                filters={filters}
                                setFilters={setFilters}
                                loading={isSubmitting}
                                headers={payoutLogsHeaders}
                                pagination={pagination}
                                dateFilters={[{ title: "Date", from: "from", to: "to", fromTitle: "From", toTitle: "To" }]}
                            >
                                <tbody>
                                    {rows.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                                            <td>{`${item?.disbursement_days} Days`}</td>
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
export default withFilters(PayoutManagement, additionalFilters);
