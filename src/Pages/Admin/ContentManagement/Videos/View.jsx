import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../../Components/BackButton/BackButton2";
import withModal from "../../../../HOC/withModal";
import { getDetails, post } from "../../../../Services/Api";
import { Select } from "../../../../Components/Select";
import { statusOptions } from "../../../../Config/TableStatus";
import "./style.css";

const videoViewSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const VideoView = ({ showModal }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadVideo = async () => {
    const res = await getDetails(`/workout-content/video/${videoId}`);
    if (res?.status) setVideo(res?.data);
    else setVideo(null);
    return res;
  };

  const fetchVideo = async () => {
    try {
      await loadVideo();
    } catch (error) {
      console.error("Unable to fetch video details:", error);
      setVideo(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getDetails(`/workout-content/video/${videoId}`);
        if (!cancelled) {
          if (res?.status) setVideo(res?.data);
          else setVideo(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to fetch video details:", error);
          setVideo(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const handleStatusChange = (e) => {
    const newStatusValue = e;
    showModal(
      `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this video's status to ${newStatusValue == "1" ? "Active" : "Inactive"}?`,
      async () => {
        await post(`/workout-content/video/${videoId}/status`);
        await fetchVideo();
        showModal(
          "Successful",
          `Video status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"} successfully.`,
          null,
          true,
        );
      },
    );
  };

  return (
    <DashboardLayout pageTitle="Content Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mainTitle mb-0">
              <BackButton2 />
              View Video
            </h2>
            <div className="status-action">
              {loading ? (
                <Skeleton
                  width={160}
                  height={44}
                  borderRadius={8}
                  {...videoViewSkeletonProps}
                />
              ) : (
                <Select
                  className={`tabel-select status${video?.status ? "Active" : "Inactive"}`}
                  name="status"
                  value={video?.status ? "1" : "0"}
                  onChange={handleStatusChange}
                >
                  {statusOptions}
                </Select>
              )}
            </div>
          </div>

          <div className="row video-view">
            <div className="col-12 col-xxl-8">
              {loading ? (
                <>
                  <div className="mb-3">
                    <Skeleton
                      width="20%"
                      height={20}
                      {...videoViewSkeletonProps}
                      className="mb-2"
                    />
                    <Skeleton
                      width="45%"
                      height={24}
                      {...videoViewSkeletonProps}
                    />
                  </div>
                  <div className="row mb-4">
                    {Array.from({ length: 2 }, (_, index) => (
                      <div className="col-md-4" key={`video-field-sk-${index}`}>
                        <Skeleton
                          width="40%"
                          height={20}
                          {...videoViewSkeletonProps}
                          className="mb-2"
                        />
                        <Skeleton
                          width="55%"
                          height={24}
                          {...videoViewSkeletonProps}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mb-3">
                    <Skeleton
                      width="25%"
                      height={20}
                      {...videoViewSkeletonProps}
                      className="mb-2"
                    />
                    <Skeleton
                      count={3}
                      height={18}
                      {...videoViewSkeletonProps}
                    />
                  </div>
                  <div className="mb-3 media">
                    <Skeleton
                      width="22%"
                      height={20}
                      {...videoViewSkeletonProps}
                      className="mb-2"
                    />
                    <Skeleton
                      width={240}
                      height={160}
                      borderRadius={10}
                      {...videoViewSkeletonProps}
                    />
                  </div>
                  <div className="mb-3 media">
                    <Skeleton
                      width="15%"
                      height={20}
                      {...videoViewSkeletonProps}
                      className="mb-2"
                    />
                    <Skeleton
                      width="100%"
                      height={280}
                      borderRadius={10}
                      {...videoViewSkeletonProps}
                    />
                  </div>
                  <Skeleton
                    width={140}
                    height={44}
                    borderRadius={8}
                    {...videoViewSkeletonProps}
                  />
                </>
              ) : (
                <>
              <div className="mb-3">
                <h5 className="detail-label">Exercise:</h5>
                <p className="detail-value">{video?.exercise?.text ?? "-"}</p>
              </div>
              <div className="row mb-4">
                <div className="col-md-4">
                  <h5 className="detail-label">Sets:</h5>
                  <p className="detail-value">{video?.sets ?? "-"}</p>
                </div>
                <div className="col-md-4">
                  <h5 className="detail-label">Rest Time:</h5>
                  <p className="detail-value">
                    {video?.rest_time ? video?.rest_time + " minutes" : "-"}
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <h5 className="detail-label">Description:</h5>
                <p className="detail-value-weak">{video?.description ?? "-"}</p>
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
                  <video
                    src={video.video}
                    controls
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "auto",
                      maxHeight: "400px",
                    }}
                  />
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/admin/content-management/videos/${videoId}/edit`)
                }
              >
                Edit Video
              </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(VideoView);
