import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { getDetails, post } from "../../../Services/Api";
import withModal from "../../../HOC/withModal";
import { Dropdown } from "react-bootstrap";
import "./style.css";

const PostView = ({ showModal }) => {
  const { t } = useTranslation();
    const { id } = useParams();
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDetails(`/post/${id}/detail`);
                if (res?.status && res?.data) {
                    const d = res.data;
                    setDetail({
                        id: d.id,
                        user: d.user,
                        post: {
                            title: d.title,
                            media: Array.isArray(d.post_media) ? d.post_media.map((m) => m.path) : [],
                            reaction_count: d.reaction_count,
                            comment_count: d.comment_count,
                            time_ago: d.time_ago,
                        },
                    });
                }
            } catch (e) {
                console.error("Error fetching post detail:", e);
            }
        };
        fetchDetail();
    }, [id]);

    const media = useMemo(() => (detail?.post?.media || []), [detail]);

    const handleDelete = () => {
        showModal(
            "Delete Post",
            "Are you sure you want to delete this post?",
            async () => {
                try {
                    const res = await post(`/post/${id}/delete`, {});
                    if (res?.status) {
                        showModal(null, "Post deleted successfully", null, true);
                    } else {
                        showModal("Failed", res?.message || "Could not delete post.", null, true);
                    }
                } catch (e) {
                    console.error("Error deleting post:", e);
                    showModal("Failed", "Could not delete post.", null, true);
                }
            }
        );
    };

    return (
        <DashboardLayout pageTitle={t('pages.user_post')}>
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="mainTitle mb-0"><BackButton2 /> User Post</h2>
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="secondary" className="btn btn-secondary" bsPrefix="btn">•••</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleDelete}>Delete Post</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="post-card">
                        <div className="post-header d-flex align-items-center gap-3 mb-2">
                            <div className="detail-box-img">
                                <img src={detail?.user?.photo} alt="user" />
                            </div>
                            <div className="flex-grow-1">
                                <div className="fw-semibold text-white">
                                    {detail ? `${detail?.user?.first_name ?? ""} ${detail?.user?.last_name ?? ""}`.trim() : "User"}
                                </div>
                                <div className="text-grey small">{detail?.post?.time_ago || ""}</div>
                            </div>
                        </div>

                        {detail?.post?.title && (
                            <p className="text-light mb-3">{detail?.post?.title}</p>
                        )}

                        <div className="post-media-grid mb-3">
                            {media.length ? (
                                media.map((src, idx) => (
                                    <div className="post-media" key={idx}>
                                        <img src={src} alt={`media-${idx}`} />
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="post-media placeholder" />
                                    <div className="post-media placeholder" />
                                    <div className="post-media placeholder" />
                                </>
                            )}
                        </div>

                        <div className="d-flex justify-content-between text-light">
                            <div>👍😂😢{detail?.post?.reaction_count ? `${detail?.post?.reaction_count} Likes` : ""}</div>
                            <div>{detail?.post?.comment_count ? `${detail?.post?.comment_count} Comments` : ""}</div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(PostView);

