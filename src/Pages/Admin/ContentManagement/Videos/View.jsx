import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../../Components/BackButton/BackButton2";
import withModal from "../../../../HOC/withModal";
import { getDetails, post } from "../../../../Services/Api";
import { Select } from "../../../../Components/Select";
import { statusOptions } from "../../../../Config/TableStatus";
import "./style.css";

const VideoView = ({ showModal }) => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);

    const fetchVideo = async () => {
        const res = await getDetails(`/workout-content/video/${videoId}`);
        if (res?.status) setVideo(res?.data);
    };

    useEffect(() => { fetchVideo(); }, [videoId]);

    const handleStatusChange = (e) => {
        const newStatusValue = e;
        showModal(
            `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
            `Are you sure you want to change this video's status to ${newStatusValue == "1" ? "Active" : "Inactive"}?`,
            async () => {
                await post(`/workout-content/video/${videoId}/status`);
                await fetchVideo();
                showModal("Successful", `Video status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"} successfully.`, null, true);
            }
        );
    };

    return (
        <DashboardLayout pageTitle="Content Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mainTitle mb-0"><BackButton2 />View Video</h2>
                        <div className="status-action">
                            <Select
                                className={`tabel-select status${video?.status ? "Active" : "Inactive"}`}
                                name="status"
                                value={video?.status ? "1" : "0"}
                                onChange={handleStatusChange}
                            >
                                {statusOptions}
                            </Select>
                        </div>
                    </div>

                    <div className="row video-view">
                        <div className="col-12 col-xxl-8">
                            <div className="mb-3">
                                <h5 className="detail-label">Title:</h5>
                                <p className="detail-value">{video?.title ?? '-'}</p>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <h5 className="detail-label">Language:</h5>
                                    <p className="detail-value">{video?.language ? video?.language.charAt(0).toUpperCase()
                                        + video?.language.slice(1) : '-'}</p>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="detail-label">Sets:</h5>
                                    <p className="detail-value">{video?.sets ?? '-'}</p>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="detail-label">Rest Time:</h5>
                                    <p className="detail-value">{video?.rest_time ? video?.rest_time + " minutes" : '-'}</p>
                                </div>
                            </div>
                            {video?.thumbnail && (
                                <div className="mb-3 media">
                                    <h5 className="detail-label">Thumbnail:</h5>
                                    <img src={video.thumbnail} alt="thumb" />
                                </div>
                            )}
                            {video?.video && (
                                <div className="mb-3 media">
                                    <h5 className="detail-label">Video:</h5>
                                    <video src={video.video} controls />
                                </div>
                            )}
                            <div className="mb-3">
                                <h5 className="detail-label">Description:</h5>
                                <p className="detail-value-weak">{video?.description ?? '-'}</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => navigate(`/admin/content-management/videos/${videoId}/edit`)}>Edit Video</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(VideoView);
