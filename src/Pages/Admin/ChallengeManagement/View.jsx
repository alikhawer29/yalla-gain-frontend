import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import withModal from "../../../HOC/withModal";
import { useFormState } from "react-dom";
import { getDetails, post } from "../../../Services/Api";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";

// Simple static dataset (should align with index list)
const STATIC_CHALLENGES = [
    { id: 1, title: "Abc", type: "run", upload_date: "12/03/2024", duration: "1 Day", flow_status: "Upcoming", status: 1, reward: "10 Yalla Coin", milestone: "Run 1 hour daily", description: "Lorem ipsum dolor set amet.", image: "" },
    { id: 2, title: "Xyz", type: "workout", upload_date: "12/03/2024", duration: "10 Day", flow_status: "Ongoing", status: 0, reward: "5 Yalla Coin", milestone: "10 pushups daily", description: "Lorem ipsum", image: "" },
];

const capitalize = (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

const ChallengeView = ({ showModal }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const fetchContent = async () => {
        try {
            const res = await getDetails(`/challenge/${id}`);
            if (res?.status) setData(res?.data);
        } catch (e) { }
    };

    useEffect(() => { fetchContent(); }, [id]);

    const handleStatusChange = (e) => {
        const newStatusValue = e;
        showModal(
            `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
            `Are you sure you want to change this challenge's status to ${newStatusValue == "1" ? "Active" : "Inactive"}?`,
            () => onConfirmStatusChange(newStatusValue)
        );
    };

    const onConfirmStatusChange = async (newStatusValue) => {
        await post(`/challenge/${id}/status`);
        await fetchContent();
        showModal("Successful", `Challenge status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"} successfully.`, null, true);
    };
    // const data = useMemo(() => STATIC_CHALLENGES.find((x) => String(x.id) === String(id)), [id]);

    return (
        <DashboardLayout pageTitle="Challenge Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mainTitle mb-0"><BackButton2 />View Challenge</h2>
                        <div className="d-flex align-items-center gap-2">
                            <div className="status-action">
                                <Select
                                    className={`tabel-select status${data?.status ? "Active" : "Inactive"}`}
                                    id={`status${id}`}
                                    name="status"
                                    label=""
                                    value={data?.status ? "1" : "0"}
                                    onChange={handleStatusChange}
                                    labelclass="me-2 mb-0"
                                >
                                    {statusOptions}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="row content-view">
                        <div className="col-12 col-xxl-8">
                            {data?.image && (
                                <div className="mb-3">
                                    <img src={data.image} alt="challenge" style={{ maxWidth: 420, borderRadius: 8 }} />
                                </div>
                            )}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <h5 className="detail-label">Challenge Title</h5>
                                    <p className="detail-value">{data?.title ?? '-'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="detail-label">Type Of Challenge</h5>
                                    <p className="detail-value">{capitalize(data?.type) ?? '-'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="detail-label">Milestone To Be Achieved</h5>
                                    <p className="detail-value">{data?.milestone ?? '-'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="detail-label">Duration</h5>
                                    <p className="detail-value">{data?.duration ? data?.duration + " Days" : '-'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="detail-label">Reward</h5>
                                    <p className="detail-value">{data?.reward ? data?.reward + " Yalla Coin" : '-'}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h5 className="detail-label">Description:</h5>
                                <p className="detail-value-weak mb-0">{data?.description ?? '-'}</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => navigate(`/admin/challenges/${id}/edit`)}>Edit Challenge</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(ChallengeView);

