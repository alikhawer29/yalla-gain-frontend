import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import withModal from "../../../HOC/withModal";
import { images } from "../../../Assets";
import { dateFormat } from "../../../Utils/helper";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";

const NewsfeedView = ({ showModal, reasonModal, closeModal }) => {
  const { t } = useTranslation();
    const { id } = useParams();
    const [status, setStatus] = useState("Pending");

    const [detail, setDetail] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDetails(`/reports/feed/${id}`);
                if (res?.status && res?.data) {
                    const data = res.data;
                    setDetail({
                        id: data?.id,
                        created_at: data?.created_at,
                        reason: data?.reason,
                        user: {
                            id: data?.user?.id,
                            first_name: data?.user?.first_name,
                            last_name: data?.user?.last_name,
                            email: data?.user?.email,
                            phone: data?.user?.phone,
                            photo: data?.user?.photo || images.placeholder,
                        },
                        post_id: data?.post?.id,
                    });
                    setStatus(data?.status === 1 ? "Pending" : "Resolved");
                }
            } catch (e) {
                console.error("Error fetching feed report detail:", e);
            }
        };
        fetchDetail();
    }, [id]);

    const onResolve = () => {
        showModal(
            "Resolved Report",
            "Are you sure you want to mark this report as Resolved?",
            async () => {
                try {
                    const res = await post(`/reports/feed/${id}/status`, {});
                    if (res?.status) {
                        setStatus("Resolved");
                        reasonModal(null, "Report has been marked resolved", closeModal, true, false, "", "", "", "", true);
                    } else {
                        showModal("Failed", res?.message || "Could not resolve report.", null, true);
                    }
                } catch (e) {
                    console.error("Error updating feed report status:", e);
                    showModal("Failed", "Could not resolve report.", null, true);
                }
            },
            false
        );
    };

    return (
        <DashboardLayout pageTitle={t('pages.view_report')}>
            <div className="container-fluid">
                <div className="dashCard report-view">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="mainTitle mb-0"><BackButton2 /> View Report</h2>
                        <div>
                            <label style={{ color: "#666" }} className="fw-medium">Status</label>
                            <span className={`ms-2 fw-semibold status ${status.toLowerCase()}`}>{status}</span>
                        </div>
                    </div>

                    <div className="d-flex flex-md-row flex-column">
                        <div className="flex-grow-1 order-1 order-md-0">
                            <div className="row">
                                <div className="col-xxl-10 col-lg-9">
                                    {/* User Detail */}
                                    <div className="mb-4">
                                        <h2 className="my-2 sub-title">User Detail</h2>
                                        <div className="booking-detail-card">
                                            <div className="d-flex align-items-center flex-wrap">
                                                <div className="d-flex gap-sm-3 gap-2 align-items-center">
                                                    {/* <img className="smallProfileImage roundedBorders" src={detail?.user?.photo || images.placeholder} alt="user" /> */}
                                                    <div className="d-flex align-items-center gap-5 my-4">
                                                        <div className="detail-box-img">
                                                            <img src={detail?.user?.photo} alt="user" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="info-label">User Name</span>
                                                        <p className="info-value mb-0" style={{ fontSize: 16 }}>
                                                            {[detail?.user?.first_name, detail?.user?.last_name].filter(Boolean).join(" ") || "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="ms-3">
                                                    <Link className="btn btn-secondary" to={`/admin/user-management/${detail?.user?.id || ""}`}>View User Details</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            {[
                                                { label: "User Name", value: [detail?.user?.first_name, detail?.user?.last_name].filter(Boolean).join(" ") },
                                                { label: "Phone Number", value: detail?.user?.phone },
                                                { label: "E-Mail Address", value: detail?.user?.email },
                                            ].map(({ label, value }) => (
                                                <div className="col-xxl-3 col-xl-6 mb-3" key={label}>
                                                    <div className="detail-box">
                                                        <h6>{label}</h6>
                                                        <p className="mb-0">{value || "-"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Report Details */}
                                    <h2 className="mb-4 sub-title">Report Details</h2>
                                    <div className="row my-2">
                                        <div className="col-xxl-3 col-xl-6 mb-3">
                                            <div className="detail-box">
                                                <h6>Report Date</h6>
                                                <p className="mb-0">{dateFormat(detail?.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="col-xxl-6 col-xl-12 mb-3">
                                            <div className="detail-box">
                                                <h6>Message</h6>
                                                <p className="mb-0">{detail?.reason || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-2">
                                        {status === "Pending" && (
                                            <button className="btn btn-primary" onClick={onResolve}>Mark As Resolved</button>
                                        )}
                                        {detail?.post_id && <Link className="btn btn-secondary" to={`/admin/reports-management/newsfeed/${detail?.post_id}/post`}>View Post</Link>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </DashboardLayout>
    );
};

export default withModal(NewsfeedView);
