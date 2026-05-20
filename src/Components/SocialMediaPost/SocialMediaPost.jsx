import React, { useEffect, useState } from "react";
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
import withModal from "../../HOC/withModal";
import { images } from "../../Assets";

const ClickablePostImage = ({ src, alt = "Post image", className = "", onOpen }) => {
  if (!src) return null;

  return (
    <button
      type="button"
      className={`post-image-button ${className}`.trim()}
      onClick={() => onOpen?.(src)}
      aria-label="View full image"
    >
      <img src={src} alt={alt} className="grid-img" />
    </button>
  );
};

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
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const { user, content, interactions, comments } = postData;
  const [usersReacted, setUsersReacted] = useState(
    interactions?.usersReacted || [],
  );
  const [commentsState, setCommentsState] = useState(comments || []);
  
  const reactionsIcons = {
    like: Like,
    love: Love,
    haha: Haha,
    wow: Wow,
    sad: Sad,
    angry: Angry,
  };

  const handleDeletePost = () => {
    showModal(
      `Delete Post`,
      `Are you sure you want to delete this post?`,
      () => onConfirmDeletePostHandler(),
    );
  };

  const onConfirmDeletePostHandler = async () => {
    try {
      if (onConfirmDeletePost) {
        const res = await onConfirmDeletePost(postId);
        if (!res?.status) throw new Error("Delete failed");
      }
      showModal(
        "Successful",
        `This post has been deleted successfully!`,
        null,
        true,
      );
    } catch (e) {
      showModal("Error", `Failed to delete this post.`, null, true);
    }
  };

  const handleDeleteComment = (commentId) => {
    showModal(
      `Delete Comment`,
      `Are you sure you want to delete this comment?`,
      () => onConfirmDeleteCommentHandler(commentId),
    );
  };

  const onConfirmDeleteCommentHandler = async (commentId) => {
    try {
      if (onConfirmDeleteComment && commentId) {
        const res = await onConfirmDeleteComment(commentId);
        if (!res?.status) throw new Error("Delete failed");
      }
      setCommentsState((prev) => prev.filter((c) => c.commentId !== commentId));
      setShowComments(false);
      showModal(
        "Successful",
        `This comment has been deleted successfully!`,
        null,
        true,
      );
    } catch (e) {
      showModal("Error", `Failed to delete this comment.`, null, true);
    }
  };

  useEffect(() => {
    if (!lightboxSrc) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxSrc]);

  useEffect(() => {
    const loadReactions = async () => {
      if (
        showReactions &&
        usersReacted?.length === 0 &&
        typeof onFetchReactions === "function"
      ) {
        const list = await onFetchReactions(postId);
        if (Array.isArray(list)) setUsersReacted(list);
      }
    };
    loadReactions();
  }, [showReactions]);

  useEffect(() => {
    const loadComments = async () => {
      if (
        showComments &&
        commentsState?.length === 0 &&
        typeof onFetchComments === "function"
      ) {
        const list = await onFetchComments(postId);
        if (Array.isArray(list)) setCommentsState(list);
      }
    };
    loadComments();
  }, [showComments]);

  const renderImageGrid = (imgs) => {
    if (!imgs || imgs.length === 0) return null;
    const count = imgs.length;
    const openImage = (src) => setLightboxSrc(src);

    if (count === 1) {
      return (
        <div className="post-image-grid single">
          <ClickablePostImage
            src={imgs[0]}
            alt="Post"
            onOpen={openImage}
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="post-image-grid double">
          <ClickablePostImage src={imgs[0]} alt="Post 1" onOpen={openImage} />
          <ClickablePostImage src={imgs[1]} alt="Post 2" onOpen={openImage} />
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="post-image-grid triple">
          <ClickablePostImage
            src={imgs[0]}
            alt="Post 1"
            className="large"
            onOpen={openImage}
          />
          <div className="grid-stack">
            <ClickablePostImage src={imgs[1]} alt="Post 2" onOpen={openImage} />
            <ClickablePostImage src={imgs[2]} alt="Post 3" onOpen={openImage} />
          </div>
        </div>
      );
    }

    // 4 or more
    return (
      <div className="post-image-grid multi">
        <ClickablePostImage
          src={imgs[0]}
          alt="Post 1"
          className="large"
          onOpen={openImage}
        />
        <div className="grid-stack">
          <ClickablePostImage src={imgs[1]} alt="Post 2" onOpen={openImage} />
          <div className="grid-row">
            <ClickablePostImage src={imgs[2]} alt="Post 3" onOpen={openImage} />
            <div className="overflow-wrapper">
              <ClickablePostImage src={imgs[3]} alt="Post 4" onOpen={openImage} />
              {count > 4 && (
                <button
                  type="button"
                  className="overlay overlay-button"
                  onClick={() => openImage(imgs[3])}
                  aria-label={`View image, ${count - 4} more`}
                >
                  +{count - 4}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPoll = (poll) => {
    if (!poll || !poll.isPoll) return null;
    const totalVotes = Array.isArray(poll.options)
      ? poll.options.reduce((sum, o) => sum + (Number(o.votes) || 0), 0)
      : 0;

    return (
      <div className="post-poll">
        {poll.options.map((opt, i) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={i} className="poll-option-wrapper">
              <div className="poll-option-info">
                 <span className="option-text">{opt.text}</span>
                 <span className="option-votes">{opt.votes} {opt.votes === 1 ? 'vote' : 'votes'}</span>
              </div>
              <div className="poll-progress-bar">
                <div 
                  className={`poll-progress-fill ${opt.isSelected ? 'selected' : ''}`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        <div className="poll-total-info">
          Total: {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="social-post">
        <div className="post-header">
          <div className="user-profile">
            <img
              src={user.profileImage}
              alt={user.name}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = images.adminProfileImg;
              }}
            />
            <div className="user-info">
              <h4 className="user-name">{user.name}</h4>
              <p className="post-time">{calculateTimePassed(new Date(user.timestamp))}</p>
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

        <div className="post-body">
          <p className="post-text">{content.text}</p>
          {content.poll?.isPoll ? renderPoll(content.poll) : renderImageGrid(content.image)}
        </div>

        <div className="post-footer">
          <div className="footer-left" onClick={() => setShowReactions(true)}>
            <div className="reaction-icons">
               <Like className="mini-reaction" />
               <Love className="mini-reaction" />
               <Haha className="mini-reaction" />
            </div>
            <span className="reaction-count">
              {formatNumber(sumReactions(interactions.reactions))} Likes
            </span>
          </div>
          <div className="footer-right" onClick={() => setShowComments(true)}>
            <span className="comment-count">
              {formatNumber(interactions.comments)} Comments
            </span>
          </div>
        </div>
      </div>

      {/* Reactions Modal */}
      <CustomModal
        show={showReactions}
        hideClose={true}
        close={() => setShowReactions(false)}
        background="gray"
        size="lg"
      >
        <div className="modal-header-custom">
          <h4 className="modal-title">People Who Reacted</h4>
          <button className="modal-close-btn" onClick={() => setShowReactions(false)}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-reactions-summary my-3">
           {Object.entries(interactions.reactions).map(([type, count]) => (
             count > 0 && (
               <div key={type} className="reaction-pill">
                  {(() => {
                    const Icon = reactionsIcons[type];
                    return <Icon width={18} height={18} />;
                  })()}
                  <span>{formatNumber(count)}</span>
               </div>
             )
           ))}
        </div>
        <div className="modal-user-list custom-scroll">
          {usersReacted?.map((r, idx) => (
            <div key={idx} className="modal-user-item">
              <div className="avatar-wrapper">
                <img src={r?.profileImage} alt={r.name} onError={(e) => e.target.src = images.adminProfileImg} />
                <div className="reaction-badge">
                  {(() => {
                    const Icon = reactionsIcons[r.reacted || "like"];
                    return <Icon width={14} height={14} />;
                  })()}
                </div>
              </div>
              <span className="user-name">{r.name}</span>
            </div>
          ))}
        </div>
      </CustomModal>

      {/* Comments Modal */}
      <CustomModal
        show={showComments}
        hideClose={true}
        close={() => setShowComments(false)}
        size="lg"
        background="gray"
      >
        <div className="modal-header-custom">
          <h4 className="modal-title">People Who Commented</h4>
          <button className="modal-close-btn" onClick={() => setShowComments(false)}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="modal-user-list custom-scroll mt-3">
          {commentsState?.map((comment, idx) => (
            <div key={idx} className="comment-item">
              <img src={comment?.userProfileImage} alt={comment.userName} className="comment-avatar" onError={(e) => e.target.src = images.adminProfileImg} />
              <div className="comment-details">
                <div className="comment-header">
                  <h6 className="comment-user-name">{comment.userName}</h6>
                  <Dropdown align="end">
                    <Dropdown.Toggle as="div" className="comment-menu-toggle">
                      <FaEllipsisH size={14} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="comment-dropdown">
                      <Dropdown.Item onClick={() => handleDeleteComment(comment.commentId)}>
                        <FaTrash size={12} className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <p className="comment-content">{comment.text}</p>
                {comment.timestamp && (
                  <p className="comment-time">{calculateTimePassed(new Date(comment.timestamp))}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CustomModal>

      {lightboxSrc && (
        <div
          className="post-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            className="post-image-lightbox-close"
            aria-label="Close image"
            onClick={() => setLightboxSrc(null)}
          >
            <IoClose size={28} />
          </button>
          <img
            src={lightboxSrc}
            alt="Full size"
            className="post-image-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default withModal(SocialMediaPost);
