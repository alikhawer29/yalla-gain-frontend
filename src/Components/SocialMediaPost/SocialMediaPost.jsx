import React, { useEffect, useState } from "react";
import { GiEarthAmerica } from "react-icons/gi";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisH, FaTrash, FaUserFriends } from "react-icons/fa";
import Like from "./reactions/like.svg?react";
import Love from "./reactions/love.svg?react";
import Haha from "./reactions/haha.svg?react";
import Wow from "./reactions/wow.svg?react";
import Sad from "./reactions/sad.svg?react";
import Angry from "./reactions/angry.svg?react";
import "./SocialMediaPost.css";
import CustomModal from "../../Components/CustomModal";
import { IoClose } from "react-icons/io5";
import ImageGallery from "../../Components/ImageGallery/ImageGallery";
import {
  calculateTimePassed,
  formatNumber,
  sumReactions,
} from "../../Utils/helper";
import withModal from "../../HOC/withModal";

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

  const { user, content, interactions, comments, privacy } = postData;
  const poll = content?.poll;
  const [usersReacted, setUsersReacted] = useState(
    interactions?.usersReacted || [],
  );
  const [commentsState, setCommentsState] = useState(comments || []);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState(null);
  let IconToBeUsed;
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
      `delete post`,
      `Are you sure you wants to delete this post?`,
      () => onConfirmDeletePostHandler(),
    );
  };

  // Confirm status change and update the state
  const onConfirmDeletePostHandler = async () => {
    try {
      if (onConfirmDeletePost) {
        const res = await onConfirmDeletePost(postId);
        if (!res?.status) throw new Error("Delete failed");
      }
      showModal(
        "Successful",
        `this post has been deleted successfully!`,
        null,
        true,
      );
    } catch (e) {
      showModal("Error", `Failed to delete this post.`, null, true);
    }
  };
  const handleDeleteComment = (commentId) => {
    setPendingDeleteCommentId(commentId);
    showModal(
      `delete comment`,
      `Are you sure you wants to delete this Comment?`,
      () => onConfirmDeleteCommentHandler(commentId),
    );
  };

  // Confirm status change and update the state
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
        `this comment has been deleted successfully!`,
        null,
        true,
      );
    } catch (e) {
      showModal("Error", `Failed to delete this comment.`, null, true);
    } finally {
      setPendingDeleteCommentId(null);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);
  return (
    <>
      <div className="post">
        <div className="post-header">
          <img
            src={user.profileImage}
            alt={user.name}
            className="profile-image"
          />
          <div className="post-user-info">
            <h2>{user.name}</h2>
            <div className="d-flex align-items-center gap-2">
              <p>{calculateTimePassed(new Date(user.timestamp))}</p>
              {privacy == "public" && <GiEarthAmerica color="#818A97" />}
              {privacy == "friends" && <FaUserFriends color="#818A97" />}
            </div>
          </div>
          <Dropdown className="elipses-wrapper">
            <Dropdown.Toggle
              variant="transparent "
              className="notButton classicToggle "
            >
              <FaEllipsisH color="#fff" />
            </Dropdown.Toggle>
            <Dropdown.Menu
              onClick={() => {
                handleDeletePost();
              }}
              align="end"
              className="dropdownMenu px-3 cp"
            >
              <button className="d-flex gap-3 align-items-center border-0 bg-transparent rounded">
                <FaTrash />
                <p className="text-decoration-none m-0">Delete Post</p>
              </button>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="post-content">
          <p>{content.text}</p>
          {poll?.isPoll ? (
            <div className="post-media w-50 p-4">
              {(() => {
                const totalVotes = Array.isArray(poll?.options)
                  ? poll.options.reduce(
                      (sum, o) => sum + (Number(o?.votes) || 0),
                      0,
                    )
                  : 0;
                return (
                  <div>
                    {poll?.options?.map((opt) => {
                      const pct = totalVotes
                        ? Math.round(
                            ((Number(opt?.votes) || 0) / totalVotes) * 100,
                          )
                        : 0;
                      return (
                        <div
                          key={opt?.id || opt?.text}
                          className="poll-option"
                          style={{ marginBottom: 12 }}
                        >
                          <div
                            className="d-flex justify-content-between"
                            style={{ marginBottom: 6 }}
                          >
                            <span style={{ color: "#fff" }}>{opt?.text}</span>
                            <span style={{ color: "#fff" }}>
                              {Number(opt?.votes) || 0}{" "}
                              {Number(opt?.votes) === 1 ? "vote" : "votes"}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 10,
                              background: "#444",
                              borderRadius: 6,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: opt?.isSelected
                                  ? "#4CAF50"
                                  : "#888",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ marginTop: 6, color: "#bbb", fontSize: 12 }}>
                      Total: {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : content?.image?.length ? (
            <div className="">
              {/* make normal size images */}

              {content?.image?.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  className="ms-4 mb-1"
                  width={"300px"}
                  height={"200px"}
                  alt="post image"
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="post-interactions">
          <div
            className="reactions-wrapper"
            onClick={() => setShowReactions(true)}
          >
            <div className="reactions">
              {Object.entries(interactions.reactions)
                .slice(
                  0,
                  Math.min(3, Object.entries(interactions.reactions).length),
                )
                .reverse()
                .map(([reaction], i) => (
                  <div
                    key={reaction}
                    className="reaction"
                    style={{ zIndex: i + 1 }}
                  >
                    {(IconToBeUsed = reactionsIcons[reaction])}
                    <IconToBeUsed width={20} height={20} />
                  </div>
                ))}
            </div>
            <span>{formatNumber(sumReactions(interactions.reactions))}</span>
          </div>
          <div className="likes-comments">
            <span onClick={() => setShowComments(true)}>
              {formatNumber(interactions.comments)} Comments
            </span>
          </div>
        </div>
        <div className="post-comments">
          {commentsState.map((comment) => (
            <div className="single-comment">
              <div className="post-comments-header">
                <img
                  src={comment.userProfileImage}
                  alt={comment.userName}
                  className="comments-profile-image"
                />
                <div className="post-comments-user-info">
                  <h4>{comment.userName}</h4>
                  <div className="d-flex align-items-center gap-2">
                    <p>{calculateTimePassed(new Date(comment.timestamp))}</p>
                  </div>
                </div>
                <Dropdown
                  className="elipses-wrapper"
                  style={{ height: 10, position: "relative", top: "-15px" }}
                >
                  <Dropdown.Toggle
                    variant="transparent "
                    className="notButton classicToggle"
                  >
                    <FaEllipsisH color="#fff" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    align="end"
                    className="dropdownMenu px-3 cp"
                    onClick={() => {
                      handleDeleteComment();
                    }}
                  >
                    <button className="d-flex gap-3 align-items-center border-0 bg-transparent rounded">
                      <FaTrash />
                      <p className="text-decoration-none m-0">Delete</p>
                    </button>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div key={comment.commentId} className="comment">
                <p>{comment.text}</p>{" "}
                <div className="post-interactions mt-1 mb-0 px-3">
                  <div
                    className="reactions-wrapper"
                    onClick={() => setShowReactions(true)}
                  >
                    <div className="reactions">
                      {Object.entries(interactions.reactions)
                        .slice(
                          0,
                          Math.min(
                            3,
                            Object.entries(interactions.reactions).length,
                          ),
                        )
                        .reverse()
                        .map(([reaction], i) => (
                          <div
                            key={reaction}
                            className="reaction"
                            style={{ zIndex: i + 1 }}
                          >
                            {(IconToBeUsed = reactionsIcons[reaction])}
                            <IconToBeUsed width={20} height={20} />
                          </div>
                        ))}
                    </div>
                    <span>
                      {formatNumber(sumReactions(interactions.reactions))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CustomModal
        show={showReactions}
        hideClose={true}
        close={() => {
          setShowReactions(false);
        }}
        background={"gray"}
        size="lg"
      >
        <div className="d-flex justify-content-between align-items-center reactionsModal">
          <h4 className="modalHeading text-start text-white mb-0">
            People Who Reacted
          </h4>
          <button
            className="closeButton"
            onClick={() => setShowReactions(false)}
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="reactions justify-content-end my-2 flex-wrap">
          {Object.entries(interactions.reactions)
            .reverse()
            .map(([reaction], i) => (
              <div
                key={reaction}
                className="reaction me-2"
                style={{ zIndex: i + 1 }}
              >
                {(IconToBeUsed = reactionsIcons[reaction])}
                <IconToBeUsed width={20} height={20} />
                <span className="ms-1 text-white">
                  {formatNumber(interactions.reactions[reaction])}
                </span>
              </div>
            ))}

          <div className="d-flex flex-row-reverse">
            <span className="mx-2 me-3 text-white">
              All ({formatNumber(sumReactions(interactions.reactions))})
            </span>
            {Object.entries(interactions.reactions)
              .slice(
                0,
                Math.min(3, Object.entries(interactions.reactions).length),
              )
              .reverse()
              .map(([reaction], i) => (
                <div
                  key={reaction}
                  className="reaction"
                  style={{ zIndex: i + 1 }}
                >
                  {(IconToBeUsed = reactionsIcons[reaction])}
                  <IconToBeUsed width={20} height={20} />
                </div>
              ))}
          </div>
        </div>
        {usersReacted?.length && (
          <div className="reactions-user-list">
            {usersReacted?.map((user) => (
              <div className="reaction-user align-items-center gap-2 justify-content-start">
                <div className="position-relative">
                  <img src={user?.profileImage} alt={`${user.name} photo`} />
                  {(IconToBeUsed = reactionsIcons[user.reacted])}
                  <IconToBeUsed
                    width={18}
                    height={18}
                    className="user-reacted-icon"
                  />
                </div>
                <p>{user.name}</p>
              </div>
            ))}
          </div>
        )}
      </CustomModal>

      <CustomModal
        show={showComments}
        hideClose={true}
        close={() => {
          setShowComments(false);
        }}
        size="lg"
        background="gray"
      >
        <div className="d-flex justify-content-between align-items-center reactionsModal">
          <h2 className="modalHeading text-start mb-0">People Who commented</h2>
          <button
            className="closeButton"
            onClick={() => setShowComments(false)}
          >
            <IoClose size={24} />
          </button>
        </div>
        {commentsState?.length && (
          <div className="comments-user-list">
            <div className="modal-title "></div>
            {commentsState?.map((comment) => (
              <div className="comment-user align-items-start gap-2 justify-content-start">
                <img
                  src={comment?.userProfileImage}
                  alt={`${comment.userName} photo`}
                />
                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between">
                    <h6>{comment.userName}</h6>
                    <Dropdown
                      className="elipses-wrapper"
                      style={{ height: 10, position: "relative", top: "-15px" }}
                    >
                      <Dropdown.Toggle
                        variant="transparent "
                        className="notButton classicToggle p-0"
                        style={{ border: "none" }}
                      >
                        <FaEllipsisH color="#fff" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        align="end"
                        className="dropdownMenu px-3 cp"
                        style={{ background: "#333" }}
                      >
                        <button
                          className="d-flex gap-3 align-items-center border-0 bg-transparent rounded p-0"
                          onClick={() => {
                            handleDeleteComment(comment?.commentId);
                          }}
                        >
                          <FaTrash color="#fff" />
                          <p className="text-decoration-none m-0">Delete</p>
                        </button>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <p>{comment.text}</p>
                  <div className="d-flex justify-content-end">
                    {comment?.reactions && (
                      <div className="reactions">
                        {Object.entries(comment.reactions)
                          .slice(
                            0,
                            Math.min(
                              3,
                              Object.entries(comment.reactions).length,
                            ),
                          )
                          .reverse()
                          .map(([reaction], i) => (
                            <div
                              key={reaction}
                              className="reaction"
                              style={{ zIndex: i + 1 }}
                            >
                              {(IconToBeUsed = reactionsIcons[reaction])}
                              <IconToBeUsed width={20} height={20} />
                            </div>
                          ))}
                      </div>
                    )}
                    {comment?.reactions && (
                      <span className="ms-1 text-white">
                        {formatNumber(sumReactions(comment.reactions))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CustomModal>
    </>
  );
};

export default withModal(SocialMediaPost);
