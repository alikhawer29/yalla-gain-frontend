import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import SocialMediaPost from "../../../Components/SocialMediaPost/SocialMediaPost";
import { usePageTitle } from "../../../Utils/helper";
import { getAll, post as postApi } from "../../../Services/Api";
import "./style.css";

const mapApiPostToUI = (apiPost) => {
    const fullName = `${apiPost?.user?.first_name ?? ""} ${apiPost?.user?.last_name ?? ""}`.trim();
    return {
        postId: apiPost?.id,
        privacy: "public",
        status: apiPost?.user?.status === 1 ? "active" : "inactive",
        user: {
            userId: apiPost?.user?.id,
            name: fullName || apiPost?.user?.email || "User",
            profileImage: apiPost?.user?.photo,
            timestamp: apiPost?.created_at,
        },
        content: {
            text: apiPost?.title || "",
            image: Array.isArray(apiPost?.post_media) ? apiPost.post_media.map((m) => m?.path).filter(Boolean) : [],
            poll: {
                isPoll: Boolean(apiPost?.is_poll),
                options: Array.isArray(apiPost?.poll_options)
                    ? apiPost.poll_options.map((o) => ({
                          id: o?.id,
                          text: o?.option_text,
                          votes: Number(o?.votes) || 0,
                          isSelected: Boolean(o?.is_selected),
                      }))
                    : [],
            },
        },
        interactions: {
            comments: apiPost?.comment_count ?? 0,
            reactions: { like: apiPost?.reaction_count ?? 0 },
            usersReacted: [],
        },
        comments: [],
    };
};

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
                const mapped = Array.isArray(response?.data) ? response.data.map(mapApiPostToUI) : [];
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
        const res = await postApi(`/post/${postId}/delete`);
        if (res?.status) {
            setPosts((prev) => prev.filter((p) => p.postId !== postId));
        }
        return res;
    };

    const onDeleteComment = async (commentId, postId) => {
        const res = await postApi(`/comment/${commentId}/remove`);
        if (res?.status) {
            setPosts((prev) =>
                prev.map((p) =>
                    p.postId === postId
                        ? { ...p, comments: Array.isArray(p.comments) ? p.comments.filter((c) => c.commentId !== commentId) : [] }
                        : p
                )
            );
        }
        return res;
    };

    const fetchReactions = async (postId) => {
        try {
            const res = await getAll(`/post/${postId}/reacted`);
            if (res?.status && Array.isArray(res?.data)) {
                return res.data.map((r) => ({
                    userId: r?.user?.id,
                    name: `${r?.user?.first_name ?? ""} ${r?.user?.last_name ?? ""}`.trim() || r?.user?.email || "User",
                    profileImage: r?.user?.photo,
                    reacted: r?.reaction ?? "like",
                }));
            }
        } catch (e) {
            console.error("Failed to load reactions", e);
        }
        return [];
    };

    const fetchComments = async (postId) => {
        try {
            const res = await getAll(`/post/${postId}/comments`);
            if (res?.status && Array.isArray(res?.data)) {
                return res.data.map((c) => ({
                    commentId: c?.id,
                    userId: c?.user?.id,
                    userName: `${c?.user?.first_name ?? ""} ${c?.user?.last_name ?? ""}`.trim() || c?.user?.email || "User",
                    userProfileImage: c?.user?.photo,
                    text: c?.comment ?? "",
                    timestamp: null,
                }));
            }
        } catch (e) {
            console.error("Failed to load comments", e);
        }
        return [];
    };

    return (
        <DashboardLayout pageTitle="Post">
            <div className="container-fluid dashCard">
                <div className="row my-4">
                    <div className="col-12 d-flex">
                        <BackButton2 />
                        <h2 className="mainTitle mb-0">User Post</h2>
                    </div>
                </div>

                {loading && <p className="text-white">Loading posts...</p>}
                {!loading && posts?.length === 0 && <p className="text-white">No posts found.</p>}

                {posts?.map((p) => (
                    <SocialMediaPost
                        key={p.postId}
                        postId={p.postId}
                        postData={p}
                        onConfirmDeletePost={() => onDeletePost(p.postId)}
                        onConfirmDeleteComment={(commentId) => onDeleteComment(commentId, p.postId)}
                        onFetchReactions={fetchReactions}
                        onFetchComments={fetchComments}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default UserPosts;
