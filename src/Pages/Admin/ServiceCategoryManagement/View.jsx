import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import withModal from "../../../HOC/withModal";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { getDetails, post } from "../../../Services/Api";
import CustomButton from "../../../Components/CustomButton";
import "./style.css";

const formatType = (value = "") => {
  if (!value) return "-";
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const normalizeStatus = (value) => {
    if (value === 1 || value === "1" || value === true || String(value).toLowerCase() === "active") {
        return "1";
    }
    return "0";
};

const ServiceCategoryView = ({ showModal }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const fetchDetails = async () => {
        try {
            const res = await getDetails(`/service-category/${id}`);
            if (res?.status) {
                setData(res?.data || null);
            }
        } catch (error) {
            console.error("Unable to fetch category details:", error);
        }
    };

    useEffect(() => {
        fetchDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleStatusChange = (nextStatus) => {
        showModal(
            `Mark as ${nextStatus === "1" ? "Active" : "Inactive"}`,
            `Are you sure you want to change this category's status to ${nextStatus === "1" ? "Active" : "Inactive"}?`,
            () => onConfirmStatusChange(nextStatus)
        );
    };

    const onConfirmStatusChange = async (nextStatus) => {
        try {
            await post(`/service-category/${id}/status`, { status: nextStatus });
            await fetchDetails();
            showModal("Successfully", `Category status has been changed to ${nextStatus === "1" ? "Active" : "Inactive"} successfully.`, null, true);
        } catch (error) {
            console.error("Unable to change status:", error);
            showModal("Error", "Unable to change category status at the moment.", null, true);
        }
    };

    const statusValue = normalizeStatus(data?.status);

    return (
        <DashboardLayout pageTitle={t('sidebar.service_category_management')}>
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mainTitle mb-0"><BackButton2 />{t('pages.view_category')}</h2>
                        <div className="d-flex align-items-center gap-3">
                            <Select
                                className={`tabel-select status${statusValue === "1" ? "Active" : "Inactive"}`}
                                id={`category-status-${id}`}
                                name="status"
                                value={statusValue}
                                onChange={handleStatusChange}
                                isInputNeeded={false}
                            >
                                {statusOptions}
                            </Select>
                        </div>
                    </div>

                    <div className="row category-view">
                        <div className="col-12 col-xxl-8">
                            {data?.image ? (
                                <div className="mb-4 image-box">
                                    <img src={data.image} alt={data?.title || "Category"} />
                                </div>
                            ) : null}

                            <div className="row mb-4">
                                <div className="col-md-6 mb-3">
                                    <h5 className="detail-label">Category Title</h5>
                                    <p className="detail-value">{data?.title || data?.name || "-"}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h5 className="detail-label">Type</h5>
                                    <p className="detail-value">{formatType(data?.type)}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h5 className="detail-label">Status</h5>
                                    <p className={`detail-value ${statusValue === "1" ? "text-success" : "text-danger"}`}>
                                        {statusValue === "1" ? "Active" : "Inactive"}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h5 className="detail-label">Created On</h5>
                                    <p className="detail-value">{data?.created_at || "-"}</p>
                                </div>
                            </div>

                            <CustomButton text="Edit Category" variant="primary" onClick={() => navigate(`/admin/service-category-management/${id}/edit`)} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(ServiceCategoryView);


