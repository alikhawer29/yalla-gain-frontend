import {
    mapPostMediaList,
    normalizeReactionType,
} from "./postMedia";
import { getAll, post as postApi } from "../Services/Api";

export const mapApiPostToUI = (apiPost) => {
    const fullName = `${apiPost?.user?.first_name ?? ""} ${apiPost?.user?.last_name ?? ""}`.trim();
    const reactionCount = Number(apiPost?.reaction_count) || 0;
    const reactionsFromApi = Array.isArray(apiPost?.reactions)
        ? apiPost.reactions.reduce((acc, r) => {
              const type = normalizeReactionType(r?.type ?? r?.reaction);
              acc[type] = (acc[type] || 0) + 1;
              return acc;
          }, {})
        : null;

    return {
        postId: apiPost?.id,
        privacy: "public",
        status: apiPost?.user?.status === 1 ? "active" : "inactive",
        user: {
            userId: apiPost?.user?.id,
            name: fullName || apiPost?.user?.email || "User",
            profileImage: apiPost?.user?.photo,
            timestamp: apiPost?.created_at,
            timeAgo: apiPost?.time_ago || "",
        },
        content: {
            text: apiPost?.title || "",
            media: mapPostMediaList(apiPost?.post_media),
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
            reactionCount,
            reactions:
                reactionsFromApi && Object.keys(reactionsFromApi).length > 0
                    ? reactionsFromApi
                    : reactionCount > 0
                      ? { like: reactionCount }
                      : {},
            usersReacted: [],
        },
        comments: [],
    };
};

export const deletePost = async (postId) => postApi(`/post/${postId}/delete`);

export const deleteComment = async (commentId) =>
    postApi(`/comment/${commentId}/remove`);

export const fetchPostReactions = async (postId) => {
    try {
        const res = await getAll(`/post/${postId}/reacted`);
        if (res?.status && Array.isArray(res?.data)) {
            return res.data.map((r) => ({
                userId: r?.user?.id,
                name:
                    `${r?.user?.first_name ?? ""} ${r?.user?.last_name ?? ""}`.trim() ||
                    r?.user?.email ||
                    "User",
                profileImage: r?.user?.photo,
                reacted: normalizeReactionType(
                    r?.reaction ?? r?.reaction_type ?? r?.type,
                ),
            }));
        }
    } catch (e) {
        console.error("Failed to load reactions", e);
    }
    return [];
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
