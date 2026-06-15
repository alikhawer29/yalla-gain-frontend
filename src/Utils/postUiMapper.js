import {
    mapPostMediaList,
    normalizeReactionType,
} from "./postMedia";
import { getAll, post as postApi } from "../Services/Api";

export const mapApiPostToUI = (post) => ({
    postId: post.id,

    user: {
        id: post.user?.id,
        name: `${post.user?.first_name ?? ""} ${post.user?.last_name ?? ""}`.trim(),
        profileImage: post.user?.photo ?? "",
        timeAgo: post.time_ago ?? "",
        timestamp: post.created_at ?? null,
    },

    content: {
        text: post.title ?? "",
        // Normalise post_media → { path, isVideo }
        media: Array.isArray(post.post_media)
            ? post.post_media.map((m) => ({
                path: m.path,
                isVideo: m.is_video ?? m.media_type === "video",
            }))
            : [],
        image: [],   // legacy fallback – keep if you still use it elsewhere
        poll: post.is_poll
            ? { isPoll: true, options: post.poll_options ?? [] }
            : { isPoll: false },
    },

    interactions: {
        reactions: {},           // empty here; populated when modal opens
        // ↓↓↓ KEY FIX: store the single reaction_type from the list API ↓↓↓
        reactionType: post.reaction_type ?? null,
        reactionCount: post.reaction_count ?? 0,
        comments: post.comment_count ?? 0,
    },

    comments: [],
});

export const deletePost = async (postId) => postApi(`/post/${postId}/delete`);

export const deleteComment = async (commentId) =>
    postApi(`/comment/${commentId}/remove`);

export const fetchPostReactions = async (postId) => {
    try {
        const res = await getAll(`/post/${postId}/reacted`); // adjust endpoint as needed
        if (!res?.status || !Array.isArray(res.data)) return [];

        return res.data.map((r) => ({
            userId: r.user?.id ?? r.id,
            name: `${r.user?.first_name ?? ""} ${r.user?.last_name ?? ""}`.trim(),
            profileImage: r.user?.photo ?? "",
            // SocialMediaPost reads r.reacted OR r.reaction — keep both for safety
            reacted: r.reaction,
            reaction: r.reaction,
        }));
    } catch {
        return [];
    }
};

export const fetchPostComments = async (postId) => {
    try {
        const res = await getAll(`/post/${postId}/comments`);
        if (res?.status && Array.isArray(res?.data)) {
            return res.data.map((c) => ({
                commentId: c?.id,
                userId: c?.user?.id,
                userName:
                    `${c?.user?.first_name ?? ""} ${c?.user?.last_name ?? ""}`.trim() ||
                    c?.user?.email ||
                    "User",
                userProfileImage: c?.user?.photo,
                text: c?.comment ?? c?.text ?? "",
                timestamp: c?.created_at ?? c?.timestamp ?? null,
            }));
        }
    } catch (e) {
        console.error("Failed to load comments", e);
    }
    return [];
};
