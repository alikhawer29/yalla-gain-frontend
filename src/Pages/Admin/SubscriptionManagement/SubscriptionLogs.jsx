import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { Select } from "../../../Components/Select";
import { subscriptionAdminLogsHeaders } from "../../../Config/TableHeaders";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { serialNum } from "../../../Utils/helper";
import { getAll } from "../../../Services/Api";

const SubscriptionLogs = ({ filters, setFilters, pagination, updatePagination }) => {
  const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const fetchLogs = async () => {
        try {
            startSubmitting(true);
            const response = await getAll(`/subscription-logs`, filters);
            if (response.status) {
                const { data } = response;
                const { total, per_page, current_page, to } = response.meta;
                setRows(data);
                updatePagination({
                    showData: to,
                    currentPage: current_page,
                    totalRecords: total,
                    totalPages: Math.ceil(total / per_page),
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    return (
        <DashboardLayout pageTitle={t('sidebar.subscription_management')}>
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <div className="row mb-2">
                                <div className="col-12 d-flex justify-content-between align-items-center">
                                    <h2 className="mainTitle mb-0">{t('pages.subscription_logs')}</h2>
                                    <Link className="btn btn-primary" to="/admin/subscriptions/plans">Manage Subscription Plan</Link>
                                </div>
                            </div>
                            <CustomTable
                                filters={filters}
                                setFilters={setFilters}
                                loading={isSubmitting}
                                headers={subscriptionAdminLogsHeaders}
                                pagination={pagination}
                                dateFilters={[{ title: "Date", from: "from_payment_date", to: "to_payment_date", fromTitle: "Created On", toTitle: "Created To" }]}
                                selectOptions={[{
                                    main_title: "Filter by status", title: "status", options: [
                                        { value: "", text: "All" },
                                        { value: "1", text: "Active" },
                                        { value: "2", text: "Expired" },
                                    ]
                                }]}
                            >
                                <tbody>
                                    {rows.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                                            <td>{item?.user?.first_name} {item?.user?.last_name}</td>
                                            <td>{item?.user?.email}</td>
                                            <td>{item?.subscription_plan?.title}</td>
                                            <td style={{ color: item?.is_active ? "#4CD964" : "#FF5C5C" }}>{item?.is_active ? "Active" : "Expired"}</td>
                                            <td>$ {item.price_paid}</td>
                                            <td>{item?.subscribed_on}</td>
                                            <td>{item?.expired_on}</td>
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

const additionalFilters = {};
export default withFilters(SubscriptionLogs, additionalFilters);

