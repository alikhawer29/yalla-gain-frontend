import { getFileType } from "./helper";

export const isVideoMedia = (item) => {
  if (!item?.path) return false;
  if (item.is_video === true || item.media_type === "video") return true;
  return getFileType(item.path) === "video";
};

export const mapPostMediaList = (postMedia) => {
  if (!Array.isArray(postMedia)) return [];
  return postMedia
    .filter((m) => m?.path)
    .map((m) => ({
      path: m.path,
      isVideo: isVideoMedia(m),
    }));
};

/** API may return like, Love, 1, etc. */
export const normalizeReactionType = (reaction) => {
  const types = ["like", "love", "haha", "wow", "sad", "angry"];
  if (reaction == null || reaction === "") return "like";
  const raw = String(reaction).toLowerCase().trim();
  if (types.includes(raw)) return raw;
  const aliases = {
    liked: "like",
    heart: "love",
    hearts: "love",
  };
  if (aliases[raw]) return aliases[raw];
  return "like";
};

export const buildReactionCountsFromList = (reactedUsers = []) => {
  if (!Array.isArray(reactedUsers) || reactedUsers.length === 0) return {};
  return reactedUsers.reduce((acc, user) => {
    const type = normalizeReactionType(user?.reacted ?? user?.reaction);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
};
