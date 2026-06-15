import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import Like from "./reactions/like.svg?react";
import Love from "./reactions/love.svg?react";
import Haha from "./reactions/haha.svg?react";
import Wow from "./reactions/wow.svg?react";
import Sad from "./reactions/sad.svg?react";
import Angry from "./reactions/angry.svg?react";
import "./SocialMediaPost.css";
import CustomModal from "../../Components/CustomModal";
import { IoClose } from "react-icons/io5";
import {
  calculateTimePassed,
  formatNumber,
  sumReactions,
} from "../../Utils/helper";
import {
  buildReactionCountsFromList,
  normalizeReactionType,
} from "../../Utils/postMedia";
import withModal from "../../HOC/withModal";
import { images } from "../../Assets";

// ─── Reaction icon map (stable reference, defined outside component) ──────────
const REACTION_ICONS = {
  like: Like,
  love: Love,
  haha: Haha,
  wow: Wow,
  sad: Sad,
  angry: Angry,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ClickablePostImage = React.memo(
  ({ src, alt = "Post image", className = "", onOpen }) => {
    if (!src) return null;
    return (
      <button
        type="button"
        className={`post-image-button ${className}`.trim()}
        onClick={() => onOpen?.(src)}
        aria-label="View full image"
      >
        <img
          src={src}
          alt={alt}
          className="grid-img"
          loading="lazy"
          decoding="async"
        />
      </button>
    );
  },
);

/**
 * Reliable video cell.
 * - Uses a stable `key` (the src url) so React never reuses a stale <video> element.
 * - Catches load errors and shows a fallback.
 * - preload="none" on posts list → only loads when the user hits play,
 *   which also fixes the "video sometimes doesn't play" issue caused by
 *   too many concurrent network requests.
 */
const VideoCell = React.memo(({ src, className = "" }) => {
  const videoRef = useRef(null);
  const [errored, setErrored] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const handleError = useCallback(() => {
    setErrored(true);
  }, []);

  if (errored) {
    return (
      <div
        className={`post-media-cell post-media-cell--video-error ${className}`}
      >
        <span className="video-error-label">Video unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={`post-media-cell post-media-cell--video ${className}`.trim()}
    >
      {/* key=src forces a fresh <video> element when url changes */}
      <video
        key={src}
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="none" // ← don't auto-fetch; fixes concurrent-load failures
        className="grid-video"
        onError={handleError}
      />
    </div>
  );
});

const PostMediaCell = React.memo(
  ({ item, alt, className = "", onOpenImage }) => {
    if (!item?.path) return null;

    if (item.isVideo) {
      return <VideoCell src={item.path} className={className} />;
    }

    return (
      <ClickablePostImage
        src={item.path}
        alt={alt}
        className={className}
        onOpen={onOpenImage}
      />
    );
  },
);

// ─── Main component ───────────────────────────────────────────────────────────

const SocialMediaPost = ({
  postId,
  postData,
  showModal,
  onConfirmDeletePost,
  onConfirmDeleteComment,
  onFetchReactions,
  onFetchComments,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [mediaGalleryIndex, setMediaGalleryIndex] = useState(null);

  const { user, content, interactions, comments } = postData;

  // usersReacted is populated lazily when the reactions modal opens
  const [usersReacted, setUsersReacted] = useState([]);
  const [commentsState, setCommentsState] = useState(comments || []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleDeletePost = useCallback(() => {
    showModal(
      "Delete Post",
      "Are you sure you want to delete this post?",
      async () => {
        try {
          if (onConfirmDeletePost) {
            const res = await onConfirmDeletePost(postId);
            if (!res?.status) throw new Error("Delete failed");
          }
          showModal(
            "Successful",
            "This post has been deleted successfully!",
            null,
            true,
          );
        } catch {
          showModal("Error", "Failed to delete this post.", null, true);
        }
      },
    );
  }, [showModal, onConfirmDeletePost, postId]);

  const handleDeleteComment = useCallback(
    (commentId) => {
      showModal(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        async () => {
          try {
            if (onConfirmDeleteComment && commentId) {
              const res = await onConfirmDeleteComment(commentId);
              if (!res?.status) throw new Error("Delete failed");
            }
            setCommentsState((prev) =>
              prev.filter((c) => c.commentId !== commentId),
            );
            setShowComments(false);
            showModal(
              "Successful",
              "This comment has been deleted successfully!",
              null,
              true,
            );
          } catch {
            showModal("Error", "Failed to delete this comment.", null, true);
          }
        },
      );
    },
    [showModal, onConfirmDeleteComment],
  );

  const mediaItems = useMemo(() => {
    if (Array.isArray(content.media) && content.media.length > 0)
      return content.media;
    if (Array.isArray(content.image) && content.image.length > 0) {
      return content.image.map((path) => ({
        path,
        isVideo: /\.(mp4|mov|webm|ogg|avi|mkv)(\?|$)/i.test(String(path)),
      }));
    }
    return [];
  }, [content.media, content.image]);

  const openMediaGallery = useCallback(
    (startIndex = 0) => {
      if (mediaItems.length === 0) return;
      const safeIndex = Math.min(
        Math.max(startIndex, 0),
        mediaItems.length - 1,
      );
      setMediaGalleryIndex(safeIndex);
    },
    [mediaItems],
  );

  const openMediaAtPath = useCallback(
    (path) => {
      const index = mediaItems.findIndex((item) => item.path === path);
      openMediaGallery(index >= 0 ? index : 0);
    },
    [mediaItems, openMediaGallery],
  );
  const closeReactions = useCallback(() => setShowReactions(false), []);
  const closeComments = useCallback(() => setShowComments(false), []);
  const closeMediaGallery = useCallback(() => setMediaGalleryIndex(null), []);

  const showPrevMedia = useCallback(() => {
    setMediaGalleryIndex((current) => {
      if (current == null || mediaItems.length <= 1) return current;
      return (current - 1 + mediaItems.length) % mediaItems.length;
    });
  }, [mediaItems.length]);

  const showNextMedia = useCallback(() => {
    setMediaGalleryIndex((current) => {
      if (current == null || mediaItems.length <= 1) return current;
      return (current + 1) % mediaItems.length;
    });
  }, [mediaItems.length]);

  // ── Lightbox keyboard handler ────────────────────────────────────────────────

  useEffect(() => {
    if (mediaGalleryIndex == null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMediaGalleryIndex(null);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrevMedia();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        showNextMedia();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mediaGalleryIndex, showNextMedia, showPrevMedia]);

  // ── Fetch reactions when modal opens ────────────────────────────────────────

  useEffect(() => {
    if (!showReactions) {
      setUsersReacted([]);
      return undefined;
    }
    if (typeof onFetchReactions !== "function") return undefined;

    let cancelled = false;
    (async () => {
      const list = await onFetchReactions(postId);
      if (!cancelled && Array.isArray(list)) setUsersReacted(list);
    })();

    return () => {
      cancelled = true;
    };
  }, [showReactions, postId, onFetchReactions]);

  // ── Fetch comments when modal opens ─────────────────────────────────────────

  useEffect(() => {
    if (!showComments || typeof onFetchComments !== "function")
      return undefined;

    let cancelled = false;
    (async () => {
      const list = await onFetchComments(postId);
      if (!cancelled && Array.isArray(list)) setCommentsState(list);
    })();

    return () => {
      cancelled = true;
    };
  }, [showComments, postId, onFetchComments]);

  // ── Reaction summary ─────────────────────────────────────────────────────────
  //
  // Priority:
  //   1. If the modal has fetched detailed reactions → use those (most accurate).
  //   2. Else if interactions.reactions already has a type breakdown → use that.
  //   3. Else fall back to interactions.reactionType (from the list API's
  //      `reaction_type` field) so the footer icon matches what the API says.

  const reactionSummary = useMemo(() => {
    // Detailed list loaded from reactions endpoint
    if (usersReacted.length > 0) {
      return buildReactionCountsFromList(usersReacted);
    }

    // Pre-built breakdown already in interactions
    const existing = interactions.reactions || {};
    if (Object.values(existing).some((v) => v > 0)) {
      return existing;
    }

    // Seed from single reaction_type + count (list-API response)
    // interactions.reactionType comes from mapApiPostToUI (see postUiMapper fix)
    const rt = normalizeReactionType(interactions.reactionType);
    if (rt && interactions.reactionCount > 0) {
      return { [rt]: Number(interactions.reactionCount) };
    }

    return existing;
  }, [
    usersReacted,
    interactions.reactions,
    interactions.reactionType,
    interactions.reactionCount,
  ]);

  const totalReactions = useMemo(() => {
    if (interactions.reactionCount != null) {
      return Number(interactions.reactionCount) || 0;
    }
    return sumReactions(
      Object.keys(reactionSummary).length > 0
        ? reactionSummary
        : interactions.reactions || {},
    );
  }, [interactions.reactionCount, interactions.reactions, reactionSummary]);

  const postTimeLabel =
    user.timeAgo ||
    (user.timestamp ? calculateTimePassed(new Date(user.timestamp)) : "");

  // ── Render helpers ───────────────────────────────────────────────────────────

  const renderMediaGrid = useCallback(
    (items) => {
      if (!items || items.length === 0) return null;
      const count = items.length;

      if (count === 1) {
        return (
          <div
            className={`post-image-grid single ${items[0].isVideo ? "has-video" : ""}`}
          >
            <PostMediaCell item={items[0]} alt="Post" onOpenImage={openMediaAtPath} />
          </div>
        );
      }

      if (count === 2) {
        return (
          <div className="post-image-grid double">
            <PostMediaCell
              item={items[0]}
              alt="Post 1"
              onOpenImage={openMediaAtPath}
            />
            <PostMediaCell
              item={items[1]}
              alt="Post 2"
              onOpenImage={openMediaAtPath}
            />
          </div>
        );
      }

      if (count === 3) {
        return (
          <div className="post-image-grid triple">
            <PostMediaCell
              item={items[0]}
              alt="Post 1"
              className="large"
              onOpenImage={openMediaAtPath}
            />
            <div className="grid-stack">
              <PostMediaCell
                item={items[1]}
                alt="Post 2"
                onOpenImage={openMediaAtPath}
              />
              <PostMediaCell
                item={items[2]}
                alt="Post 3"
                onOpenImage={openMediaAtPath}
              />
            </div>
          </div>
        );
      }

      return (
        <div className="post-image-grid multi">
          <PostMediaCell
            item={items[0]}
            alt="Post 1"
            className="large"
            onOpenImage={openMediaAtPath}
          />
          <div className="grid-stack">
            <PostMediaCell
              item={items[1]}
              alt="Post 2"
              onOpenImage={openMediaAtPath}
            />
            <div className="grid-row">
              <PostMediaCell
                item={items[2]}
                alt="Post 3"
                onOpenImage={openMediaAtPath}
              />
              <div className="overflow-wrapper">
                <PostMediaCell
                  item={items[3]}
                  alt="Post 4"
                  onOpenImage={openMediaAtPath}
                />
                {count > 4 && (
                  <button
                    type="button"
                    className="overlay overlay-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMediaGallery(3);
                    }}
                    aria-label={`View all media, ${count - 4} more`}
                  >
                    +{count - 4}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [openMediaAtPath, openMediaGallery],
  );

  const renderPoll = useCallback((poll) => {
    if (!poll?.isPoll) return null;
    const totalVotes = Array.isArray(poll.options)
      ? poll.options.reduce((sum, o) => sum + (Number(o.votes) || 0), 0)
      : 0;

    return (
      <div className="post-poll">
        {poll.options.map((opt, i) => {
          const percentage =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={opt.id ?? i} className="poll-option-wrapper">
              <div className="poll-option-info">
                <span className="option-text">{opt.text}</span>
                <span className="option-votes">
                  {opt.votes} {opt.votes === 1 ? "vote" : "votes"}
                </span>
              </div>
              <div className="poll-progress-bar">
                <div
                  className={`poll-progress-fill ${opt.isSelected ? "selected" : ""}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        <div className="poll-total-info">
          Total: {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        </div>
      </div>
    );
  }, []);

  // ── Top reaction icons for footer (max 3 distinct types) ────────────────────
  const topReactionEntries = useMemo(
    () =>
      Object.entries(reactionSummary)
        .filter(([, count]) => count > 0)
        .slice(0, 3),
    [reactionSummary],
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="social-post">
        {/* Header */}
        <div className="post-header">
          <div className="user-profile">
            <img
              src={user.profileImage}
              alt={user.name}
              className="user-avatar"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = images.adminProfileImg;
              }}
            />
            <div className="user-info">
              <h4 className="user-name">{user.name}</h4>
              <p className="post-time">{postTimeLabel}</p>
            </div>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="menu-toggle no-caret">
              <FaEllipsisH />
            </Dropdown.Toggle>
            <Dropdown.Menu className="post-dropdown">
              <Dropdown.Item onClick={handleDeletePost} className="delete-item">
                <div className="delete-icon-box">
                  <FaTrash className="trash-icon" />
                </div>
                <span>Delete Post</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Body */}
        <div className="post-body">
          <p className="post-text">{content.text}</p>
          {content.poll?.isPoll
            ? renderPoll(content.poll)
            : renderMediaGrid(mediaItems)}
        </div>

        {/* Footer */}
        <div className="post-footer">
          <div
            className={`footer-left ${totalReactions > 0 ? "" : "is-disabled"}`}
            onClick={() => totalReactions > 0 && setShowReactions(true)}
            role={totalReactions > 0 ? "button" : undefined}
            tabIndex={totalReactions > 0 ? 0 : undefined}
            onKeyDown={(e) =>
              e.key === "Enter" && totalReactions > 0 && setShowReactions(true)
            }
          >
            <div className="reaction-icons">
              {topReactionEntries.length > 0 ? (
                topReactionEntries.map(([type]) => {
                  const Icon = REACTION_ICONS[type] || Like;
                  return <Icon key={type} className="mini-reaction" />;
                })
              ) : (
                <Like className="mini-reaction" />
              )}
            </div>
            <span className="reaction-count">
              {formatNumber(totalReactions)}{" "}
              {totalReactions === 1 ? "Like" : "Likes"}
            </span>
          </div>
          <div
            className={`footer-right ${interactions.comments > 0 ? "" : "is-disabled"}`}
            onClick={() => interactions.comments > 0 && setShowComments(true)}
            role={interactions.comments > 0 ? "button" : undefined}
            tabIndex={interactions.comments > 0 ? 0 : undefined}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              interactions.comments > 0 &&
              setShowComments(true)
            }
          >
            <span className="comment-count">
              {formatNumber(interactions.comments)} Comments
            </span>
          </div>
        </div>
      </div>

      {/* Reactions Modal */}
      <CustomModal
        show={showReactions}
        hideClose
        close={closeReactions}
        background="gray"
        size="lg"
      >
        <div className="modal-header-custom">
          <h4 className="modal-title">People Who Reacted</h4>
          <button className="modal-close-btn" onClick={closeReactions}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-reactions-summary my-3">
          {Object.entries(reactionSummary).map(([type, count]) =>
            count > 0 ? (
              <div key={type} className="reaction-pill">
                {(() => {
                  const Icon = REACTION_ICONS[type] || Like;
                  return <Icon width={18} height={18} />;
                })()}
                <span>{formatNumber(count)}</span>
              </div>
            ) : null,
          )}
        </div>
        <div className="modal-user-list custom-scroll">
          {usersReacted.length > 0 ? (
            usersReacted.map((r) => {
              const reactionKey = normalizeReactionType(
                r.reacted || r.reaction,
              );
              const Icon = REACTION_ICONS[reactionKey] || Like;
              return (
                <div key={r.userId ?? r.name} className="modal-user-item">
                  <div className="avatar-wrapper">
                    <img
                      src={r?.profileImage || r?.user?.photo}
                      alt={
                        r.name || `${r.user?.first_name} ${r.user?.last_name}`
                      }
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = images.adminProfileImg;
                      }}
                    />
                    <div className="reaction-badge">
                      <Icon width={14} height={14} />
                    </div>
                  </div>
                  <span className="user-name">
                    {r.name ||
                      `${r.user?.first_name ?? ""} ${r.user?.last_name ?? ""}`.trim()}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center text-secondary mb-0 py-3">
              No reactions found.
            </p>
          )}
        </div>
      </CustomModal>

      {/* Comments Modal */}
      <CustomModal
        show={showComments}
        hideClose
        close={closeComments}
        size="lg"
        background="gray"
      >
        <div className="modal-header-custom">
          <h4 className="modal-title">People Who Commented</h4>
          <button className="modal-close-btn" onClick={closeComments}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-user-list custom-scroll mt-3">
          {commentsState.length > 0 ? (
            commentsState.map((comment) => (
              <div
                key={comment.commentId ?? comment.userId}
                className="comment-item"
              >
                <img
                  src={comment?.userProfileImage}
                  alt={comment.userName}
                  className="comment-avatar"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = images.adminProfileImg;
                  }}
                />
                <div className="comment-details">
                  <div className="comment-header">
                    <h6 className="comment-user-name">{comment.userName}</h6>
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="div"
                        className="comment-menu-toggle no-caret"
                      >
                        <FaEllipsisH size={14} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="comment-dropdown">
                        <Dropdown.Item
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          <FaTrash size={12} className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <p className="comment-content">{comment.text}</p>
                  {comment.timestamp && (
                    <p className="comment-time">
                      {calculateTimePassed(new Date(comment.timestamp))}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-secondary mb-0 py-3">
              No comments found.
            </p>
          )}
        </div>
      </CustomModal>

      {/* Media gallery (images + videos) */}
      {mediaGalleryIndex != null && mediaItems[mediaGalleryIndex] && (
        <div
          className="post-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Media gallery"
          onClick={closeMediaGallery}
        >
          <button
            type="button"
            className="post-image-lightbox-close"
            aria-label="Close gallery"
            onClick={closeMediaGallery}
          >
            <IoClose size={28} />
          </button>

          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                className="post-image-lightbox-nav post-image-lightbox-nav--prev"
                aria-label="Previous media"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevMedia();
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="post-image-lightbox-nav post-image-lightbox-nav--next"
                aria-label="Next media"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextMedia();
                }}
              >
                ›
              </button>
              <div className="post-image-lightbox-counter">
                {mediaGalleryIndex + 1} / {mediaItems.length}
              </div>
            </>
          )}

          {mediaItems[mediaGalleryIndex].isVideo ? (
            <video
              key={mediaItems[mediaGalleryIndex].path}
              src={mediaItems[mediaGalleryIndex].path}
              controls
              playsInline
              autoPlay
              className="post-image-lightbox-img post-image-lightbox-video"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              key={mediaItems[mediaGalleryIndex].path}
              src={mediaItems[mediaGalleryIndex].path}
              alt={`Media ${mediaGalleryIndex + 1} of ${mediaItems.length}`}
              className="post-image-lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
};

export default withModal(SocialMediaPost);
