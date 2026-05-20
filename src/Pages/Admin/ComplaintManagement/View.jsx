import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { getDetails } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import "./style.css";

const ComplaintView = () => {
  const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const fetchDetail = async () => {
        try {
            startSubmitting(true);
            const response = await getDetails(`/complaint/${id}`);
            if (response?.status) setDetail(response?.data);
        } catch (e) {
            console.error("Error fetching complaint detail:", e);
        } finally {
            stopSubmitting(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <DashboardLayout pageTitle={t('sidebar.complaint_management')}>
            <div className="container-fluid">
                <div className="dashCard query-view">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4"><BackButton2 />{t('pages.view_complain')}</h2>
                            {!detail ? (
                                <p className="mb-0">{isSubmitting ? "Loading..." : "No details available"}</p>
                            ) : (
                                <div className="g-3">
                                    <h2 className="mt-5 mb-4 sub-title">User Detail</h2>
                                    <div className="row my-2">
                                        {[
                                            { label: "User Name", value: detail?.user?.first_name + " " + detail?.user?.last_name },
                                            { label: "Phone Number", value: detail?.user?.dialing_code + detail?.user?.phone },
                                            { label: "E-Mail Address", value: detail?.user?.email },
                                            { label: "Date", value: detail?.created_at },
                                            { label: "User Type", value: detail?.user?.type },
                                        ].map(({ label, value }) => (
                                            <div className="col-xxl-4 col-xl-6 mb-3" key={label}>
                                                <div className="detail-box">
                                                    <h6>{label}</h6>
                                                    <p className="mb-0">{value || "-"}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-12 mb-3" key="Message">
                                            <div className="detail-box">
                                                <h6>Message</h6>
                                                <p className="mb-0">{detail?.message || "-"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ComplaintView;
