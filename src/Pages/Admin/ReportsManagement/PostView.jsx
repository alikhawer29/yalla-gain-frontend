import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import SocialMediaPost from "../../../Components/SocialMediaPost/SocialMediaPost";
import { getDetails } from "../../../Services/Api";
import {
    deleteComment,
    deletePost,
    fetchPostComments,
    fetchPostReactions,
    mapApiPostToUI,
} from "../../../Utils/postUiMapper";
import withModal from "../../../HOC/withModal";

const postSkeletonProps = {
    baseColor: "rgba(255, 255, 255, 0.12)",
    highlightColor: "rgba(255, 255, 255, 0.2)",
};

const PostView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getDetails(`/post/${id}/detail`);
                if (res?.status && res?.data) {
                    setPostData(mapApiPostToUI(res.data));
                } else {
                    setPostData(null);
                }
            } catch (e) {
                console.error("Error fetching post detail:", e);
                setPostData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const onDeletePost = async (postId) => {
        const res = await deletePost(postId);
        if (res?.status) {
            navigate(-1);
        }
        return res;
    };

    const onDeleteComment = async (commentId, postId) => {
        const res = await deleteComment(commentId);
        if (res?.status && postData?.postId === postId) {
            setPostData((prev) =>
                prev
                    ? {
                          ...prev,
                          interactions: {
                              ...prev.interactions,
                              comments: Math.max(
                                  0,
                                  (prev.interactions.comments || 0) - 1,
                              ),
                          },
                      }
                    : prev,
            );
        }
        return res;
    };

    return (
        <DashboardLayout pageTitle="User Post">
            <div className="container-fluid dashCard">
                <div className="row my-4">
                    <h2 className="mainTitle mb-4">
                        <BackButton2 />
                        User Post
                    </h2>
                </div>

                {loading ? (
                    <div className="social-post">
                        <div className="d-flex gap-3 mb-3">
                            <Skeleton
                                circle
                                width={50}
                                height={50}
                                {...postSkeletonProps}
                            />
                            <div className="flex-grow-1">
                                <Skeleton
                                    width={160}
                                    height={20}
                                    {...postSkeletonProps}
                                    className="mb-2"
                                />
                                <Skeleton
                                    width={100}
                                    height={14}
                                    {...postSkeletonProps}
                                />
                            </div>
                        </div>
                        <Skeleton
                            width="80%"
                            height={18}
                            {...postSkeletonProps}
                            className="mb-3"
                        />
                        <Skeleton
                            height={320}
                            borderRadius={12}
                            {...postSkeletonProps}
                        />
                    </div>
                ) : postData ? (
                    <SocialMediaPost
                        postId={postData.postId}
                        postData={postData}
                        onConfirmDeletePost={() => onDeletePost(postData.postId)}
                        onConfirmDeleteComment={(commentId) =>
                            onDeleteComment(commentId, postData.postId)
                        }
                        onFetchReactions={fetchPostReactions}
                        onFetchComments={fetchPostComments}
                    />
                ) : (
                    <p className="text-white mb-0">Post not found.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default withModal(PostView);
