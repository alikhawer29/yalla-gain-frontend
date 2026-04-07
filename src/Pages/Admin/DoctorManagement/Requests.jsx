import { useEffect, useMemo, useState } from "react";
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

const STATUS_MAP = {
    "1": "Approved",
    "2": "Pending",
    "3": "Rejected",
};

const statusFilterOptions = [
    { value: "", text: "All" },
    { value: "2", text: "Pending" },
    { value: "1", text: "Approved" },
    { value: "3", text: "Rejected" },
];

const DoctorRequests = ({ filters, setFilters, pagination, updatePagination }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const apiFilters = useMemo(() => {
        const { search, page, per_page, status, from, to, fromDate, toDate } = filters;
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
                updatePagination({ showData: 0, currentPage: 1, totalRecords: 0, totalPages: 1, perPage: filters?.per_page || 10 });
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

    const startIndex = (pagination.currentPage - 1) * (pagination.perPage || filters.per_page || 10);

    return (
        <DashboardLayout pageTitle="Doctor Requests">
            <div className="container-fluid">
                <div className="dashCard doctor-requests-section">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <BackButton2 />
                            <div>
                                <h2 className="mainTitle mb-1">Doctor's Requests</h2>
                                {/* <p className="detail-subtitle mb-0">Manage new doctor onboarding requests</p> */}
                            </div>
                        </div>
                    </div>

                    <CustomTable
                        filters={filters}
                        setFilters={setFilters}
                        loading={isSubmitting}
                        headers={doctorRequestsHeaders}
                        pagination={pagination}
                        selectOptions={[{
                            main_title: "Filter by status",
                            title: "status",
                            options: statusFilterOptions,
                        }]}
                        dateFilters={[{ title: "Date", from: "from", to: "to", fromTitle: "From", toTitle: "To" }]}
                    >
                        <tbody>
                            {rows.map((request, index) => {
                                const statusKey = String(request?.status ?? "");
                                const statusLabel = STATUS_MAP[statusKey] || "-";
                                return (
                                    <tr
                                        key={request?.id ?? index}
                                        {...clickableTableRowNavProps(
                                            navigate,
                                            `/admin/doctor-management/requests/${request?.id}`,
                                        )}
                                    >
                                        <td>{serialNum(startIndex + index + 1)}</td>
                                        <td>{[request?.first_name, request?.last_name].filter(Boolean).join(" ") || request?.doctorName || "-"}</td>
                                        <td>
                                            <span className={`statusChip status${statusLabel}`}>{statusLabel}</span>
                                        </td>
                                        <td>{request?.created_at || request?.requestedDate || "-"}</td>
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
