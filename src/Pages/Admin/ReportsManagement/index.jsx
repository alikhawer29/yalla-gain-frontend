import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { serialNum, dateFormat, capitalizeFirstLetter } from "../../../Utils/helper";
import {
    reportsBookingHeaders,
    reportsNewsfeedHeaders,
} from "../../../Config/TableHeaders";
import { getAll } from "../../../Services/Api";
import "./style.css";

const mapStatus = (status) => {
    if (typeof status === "number") return status === 1 ? "Pending" : "Resolved";
    if (!status) return "Pending";
    const s = String(status).toLowerCase();
    if (["1", "pending"].includes(s)) return "Pending";
    if (["2", "resolved"].includes(s)) return "Resolved";
    return capitalizeFirstLetter(String(status));
};

const TABS = [
    { label: "Booking", value: "booking" },
    { label: "Newsfeed", value: "newsfeed" },
];

const ReportsManagement = ({ filters, setFilters, pagination, updatePagination }) => {
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [searchParams, setSearchParams] = useSearchParams();
    const [rows, setRows] = useState([]);

    const activeTab = searchParams.get("tab") || "booking";
    const setTab = (tab) => setSearchParams({ tab });

    useEffect(() => {
        const fetchList = async () => {
            try {
                startSubmitting();
                const endpoint =
                    activeTab === "newsfeed" ? "/reports/feeds" : "/reports/bookings";

                const params = { ...filters };
                // keep keys as from/to/search/page/per_page
                if (!params.from) delete params.from;
                if (!params.to) delete params.to;
                if (!params.search) delete params.search;

                const res = await getAll(endpoint, params);
                const data = Array.isArray(res?.data) ? res.data : [];
                const meta = res?.meta ?? {};

                setRows(data);
                const total = Number(meta?.total ?? data.length ?? 0);
                const perPage = Number(meta?.per_page ?? filters.per_page ?? 10);
                const currentPage = Number(meta?.current_page ?? filters.page ?? 1);
                const to = Number(meta?.to ?? Math.min(total, currentPage * perPage));
                const totalPages = Math.max(1, Number(meta?.last_page ?? Math.ceil(total / perPage)));
                updatePagination({ showData: to, currentPage, totalRecords: total, totalPages, perPage });
            } catch (e) {
                console.error("Error fetching reports:", e);
                setRows([]);
                updatePagination({ showData: 0, currentPage: 1, totalRecords: 0, totalPages: 1 });
            } finally {
                stopSubmitting();
            }
        };
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, filters]);

    return (
        <DashboardLayout pageTitle="Reports Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4">Reports Management</h2>

                            <div className="d-flex flex-wrap gap-2 mb-4 logs-type-group">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        className={`btn min-width-120 ${activeTab === tab.value ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setTab(tab.value)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <CustomTable
                                filters={filters}
                                setFilters={setFilters}
                                loading={isSubmitting}
                                headers={activeTab === "newsfeed" ? reportsNewsfeedHeaders : reportsBookingHeaders}
                                pagination={pagination}
                                dateFilters={[{ title: "Date", from: "from", to: "to", fromTitle: "From", toTitle: "To" }]}
                            >
                                <tbody>
                                    {activeTab === "booking"
                                        ? rows.map((item, index) => {
                                            const appt = item?.appointment || {};
                                            const user = appt?.user || {};
                                            const provider = appt?.service?.user || {};
                                            const bookingId = appt?.booking_id || "-";
                                            const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "-";
                                            const userType = provider?.type ? capitalizeFirstLetter(provider.type) : "-";
                                            const bookingDate = appt?.appointment_date || appt?.created_at || "-";
                                            const reportedOn = item?.created_at || "-";
                                            const charges = appt?.amount_paid || appt?.service?.charges || "-";
                                            const statusText = mapStatus(item?.status);

                                            return (
                                                <tr key={item.id}>
                                                    <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                                                    <td>{bookingId}</td>
                                                    <td>{name}</td>
                                                    <td>{userType}</td>
                                                    <td>{dateFormat(bookingDate)}</td>
                                                    <td>{dateFormat(reportedOn)}</td>
                                                    <td>{charges}</td>
                                                    <td>
                                                        <span className={`status ${statusText.toLowerCase()}`}>{statusText}</span>
                                                    </td>
                                                    <td>
                                                        <Link className="viewLink" to={`/admin/reports-management/booking/${item.id}`}>View</Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                        : rows.map((item, index) => {
                                            const u = item?.user || {};
                                            const name = [u?.first_name, u?.last_name].filter(Boolean).join(" ") || "-";
                                            const email = u?.email || "-";
                                            const reportedOn = item?.created_at || "-";
                                            const statusText = mapStatus(item?.status);

                                            return (
                                                <tr key={item.id}>
                                                    <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                                                    <td>{name}</td>
                                                    <td>{email}</td>
                                                    <td>{dateFormat(reportedOn)}</td>
                                                    <td>
                                                        <span className={`status ${statusText.toLowerCase()}`}>{statusText}</span>
                                                    </td>
                                                    <td>
                                                        <Link className="viewLink" to={`/admin/reports-management/newsfeed/${item.id}`}>View</Link>
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

const additionalFilters = { from: "", to: "" };
export default withFilters(ReportsManagement, additionalFilters);
