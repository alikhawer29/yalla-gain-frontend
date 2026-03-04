import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import CustomButton from "../../../Components/CustomButton";
import { Select } from "../../../Components/Select";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { statusOptions } from "../../../Config/TableStatus";

const PlanView = ({ showModal }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [status, setStatus] = useState("Active");

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await getDetails(`/plan/${id}`);
                if (res?.status) {
                    setPlan(res.data);
                    setStatus(res.data?.status === 1 ? "Active" : "Inactive");
                }
            } catch (e) {
                // silently ignore; could show toast
            }
        };
        fetchPlan();
    }, [id]);

    const handleStatusChange = (e, userId) => {
        const newStatusValue = e;
        showModal(
            `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
            `Are you sure you want to change this plan's status to ${newStatusValue == "1" ? "Active" : "Inactive"
            }?`,
            () => onConfirmStatusChange(userId, newStatusValue)
        );
    };

    const onConfirmStatusChange = async (userId, newStatusValue) => {
        await post(`/user/${userId}/status`, { status: newStatusValue });
        // setProfileData((prevData) => ({
        //     ...prevData,
        //     status: newStatusValue,
        // }));
        fetchPlan();
        showModal(
            "Successful",
            `Plan status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"
            } successfully.`,
            null,
            true
        );
    };

    // const onStatusChange = (next) => {
    //     const label = next === "Active" ? "Active" : "Inactive";
    //     showModal(label, `Are you sure you want to ${label.toLowerCase()} plan?`, () => {
    //         setStatus(next);
    //         setTimeout(() => showModal("Successfully", `Plan has been ${label.toLowerCase()}d successfully`, null, true), 0);
    //     });
    // };

    return (
        <DashboardLayout pageTitle="Subscription Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="mainTitle mb-0"><BackButton2 />View Plan</h2>
                                <div className="d-flex align-items-center gap-2">
                                    {/* <span className="fw-medium plan-status-color">Status</span> */}
                                    <div className="status-action">
                                        <Select
                                            className={`tabel-select status${plan?.status ? "Active" : "Inactive"}`}
                                            id={`status${id}`}
                                            name="status"
                                            label=""
                                            value={plan?.status ? "1" : "0"}
                                            onChange={(e) => handleStatusChange(e, id)}
                                            labelclass="me-2 mb-0"
                                        >
                                            {statusOptions}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="row plan-view">
                                <div className="col-12 col-xxl-8">
                                    <div className="mb-4">
                                        <h5 className="detail-label">Subscription Title:</h5>
                                        <p className="detail-value mb-0">{plan?.title ?? '-'}</p>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-4">
                                            <h5 className="detail-label">Duration:</h5>
                                            <p className="detail-value mb-0">{plan?.duration ?? '-'}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <h5 className="detail-label">Price:</h5>
                                            <p className="detail-value mb-0">{plan ? `$ ${plan.price}` : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="detail-label">Description:</h5>
                                        <p className="detail-value-weak mb-0">{plan?.description ?? '-'}</p>
                                    </div>
                                    {Array.isArray(plan?.features) && plan.features.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="detail-label">Features:</h5>
                                            <ul className="detail-features">
                                                {plan.features.map((f, idx) => (
                                                    <li key={idx} className="detail-value-weak">{f}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <CustomButton onClick={() => navigate(`/admin/subscriptions/plans/${id}/edit`)} variant="primary" text="Update Plan" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(PlanView);
