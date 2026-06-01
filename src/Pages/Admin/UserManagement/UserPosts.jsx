import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import SocialMediaPost from "../../../Components/SocialMediaPost/SocialMediaPost";
import { usePageTitle } from "../../../Utils/helper";
import {
    deleteComment,
    deletePost,
    fetchPostComments,
    fetchPostReactions,
    mapApiPostToUI,
} from "../../../Utils/postUiMapper";
import { getAll } from "../../../Services/Api";
import "./style.css";

const UserPosts = () => {
    usePageTitle("User Post");
    const { id } = useParams();
    const userId = useMemo(() => id || "2", [id]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await getAll(`/posts/${userId}`);
            if (response?.status) {
                const mapped = Array.isArray(response?.data)
                    ? response.data.map(mapApiPostToUI)
                    : [];
                setPosts(mapped);
            }
        } catch (e) {
            console.error("Failed to load posts", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const onDeletePost = async (postId) => {
        const res = await deletePost(postId);
        if (res?.status) {
            setPosts((prev) => prev.filter((p) => p.postId !== postId));
        }
        return res;
    };

    const onDeleteComment = async (commentId, postId) => {
        const res = await deleteComment(commentId);
        if (res?.status) {
            setPosts((prev) =>
                prev.map((p) =>
                    p.postId === postId
                        ? {
                              ...p,
                              interactions: {
                                  ...p.interactions,
                                  comments: Math.max(
                                      0,
                                      (p.interactions.comments || 0) - 1,
                                  ),
                              },
                          }
                        : p,
                ),
            );
        }
        return res;
    };

    return (
        <DashboardLayout pageTitle="Post">
            <div className="container-fluid dashCard">
                <div className="row my-4">
                    <h2 className="mainTitle mb-4">
                        <BackButton2 />
                        User Posts
                    </h2>
                </div>

                {loading && <p className="text-white">Loading posts...</p>}
                {!loading && posts?.length === 0 && (
                    <p className="text-white">No posts found.</p>
                )}

                {posts?.map((p) => (
                    <SocialMediaPost
                        key={p.postId}
                        postId={p.postId}
                        postData={p}
                        onConfirmDeletePost={() => onDeletePost(p.postId)}
                        onConfirmDeleteComment={(commentId) =>
                            onDeleteComment(commentId, p.postId)
                        }
                        onFetchReactions={fetchPostReactions}
                        onFetchComments={fetchPostComments}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default UserPosts;
