import React, { useState } from "react";
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
import { calculateTimePassed, formatNumber, sumReactions } from "../../Utils/helper";
import withModal from "../../HOC/withModal";

const SocialMediaPost = ({ postData, showModal }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { user, content, interactions, comments, privacy, postId } = postData;
  const [usersReacted, setUsersReacted] = useState(interactions?.usersReacted);
  let IconToBeUsed;
  const reactionsIcons = {
    like: Like,
    love: Love,
    haha: Haha,
    wow: Wow,
    sad: Sad,
    angry: Angry,
  };

  const handleDeletePost = (e, userId) => {
    showModal(`delete post`, `Are you sure you wants to delete this post?`, () => onConfirmDeletePost());
  };

  // Confirm status change and update the state
  const onConfirmDeletePost = async () => {
    showModal("Successful", `this post has been deleted successfully!`, null, true);
  };
  const handleDeleteComment = (e, userId) => {
    showModal(`delete comment`, `Are you sure you wants to delete this Comment?`, () => onConfirmDeleteComment());
  };

  // Confirm status change and update the state
  const onConfirmDeleteComment = async () => {
    setShowComments(false);
    showModal("Successful", `this comment has been deleted successfully!`, null, true);
  };
  return (
    <>
      <div className="post">
        <div className="post-header">
          <img src={user.profileImage} alt={user.name} className="profile-image" />
          <div className="post-user-info">
            <h2>{user.name}</h2>
            <div className="d-flex align-items-center gap-2">
              <p>{calculateTimePassed(new Date(user.timestamp))}</p>
              {privacy == "public" && <GiEarthAmerica color="#818A97" />}
              {privacy == "friends" && <FaUserFriends color="#818A97" />}
            </div>
          </div>
          <Dropdown className="elipses-wrapper">
            <Dropdown.Toggle variant="transparent " className="notButton classicToggle ">
              <FaEllipsisH />
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
          {content?.image?.length ? <ImageGallery scaleOnHover={false} width="100%" maxHeight="400px" images={content?.image} /> : null}
        </div>
        <div className="post-interactions">
          <div className="reactions-wrapper" onClick={() => setShowReactions(true)}>
            <div className="reactions">
              {Object.entries(interactions.reactions)
                .slice(0, Math.min(3, Object.entries(interactions.reactions).length))
                .reverse()
                .map(([reaction], i) => (
                  <div key={reaction} className="reaction" style={{ zIndex: i + 1 }}>
                    {(IconToBeUsed = reactionsIcons[reaction])}
                    <IconToBeUsed width={20} height={20} />
                  </div>
                ))}
            </div>
            <span>{formatNumber(sumReactions(interactions.reactions))}</span>
          </div>
          <div className="likes-comments">
            <span onClick={() => setShowComments(true)}>{formatNumber(interactions.comments)} Comments</span>
          </div>
        </div>
        <div className="post-comments">
          {comments.map((comment) => (
            <div className="single-comment">
              <div className="post-comments-header">
                <img src={comment.userProfileImage} alt={comment.userName} className="comments-profile-image" />
                <div className="post-comments-user-info">
                  <h4>{comment.userName}</h4>
                  <div className="d-flex align-items-center gap-2">
                    <p>{calculateTimePassed(new Date(comment.timestamp))}</p>
                  </div>
                </div>
                <Dropdown className="elipses-wrapper" style={{ height: 10, position: "relative", top: "-15px" }}>
                  <Dropdown.Toggle variant="transparent " className="notButton classicToggle">
                    <FaEllipsisH />
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
                  <div className="reactions-wrapper" onClick={() => setShowReactions(true)}>
                    <div className="reactions">
                      {Object.entries(interactions.reactions)
                        .slice(0, Math.min(3, Object.entries(interactions.reactions).length))
                        .reverse()
                        .map(([reaction], i) => (
                          <div key={reaction} className="reaction" style={{ zIndex: i + 1 }}>
                            {(IconToBeUsed = reactionsIcons[reaction])}
                            <IconToBeUsed width={20} height={20} />
                          </div>
                        ))}
                    </div>
                    <span>{formatNumber(sumReactions(interactions.reactions))}</span>
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
        <div className="d-flex justify-content-between align-items-start reactionsModal">
          <h4 className="modalHeading">People Who Reacted</h4>
          <button className="closeButton" onClick={() => setShowReactions(false)}>
            <IoClose size={24} />
          </button>
        </div>
        <div className="reactions justify-content-end my-2 flex-wrap">
          {Object.entries(interactions.reactions)
            .reverse()
            .map(([reaction], i) => (
              <div key={reaction} className="reaction me-2" style={{ zIndex: i + 1 }}>
                {(IconToBeUsed = reactionsIcons[reaction])}
                <IconToBeUsed width={20} height={20} />
                <span className="ms-1">{formatNumber(interactions.reactions[reaction])}</span>
              </div>
            ))}

          <div className="d-flex flex-row-reverse">
            <span className="mx-2 me-3">All ({formatNumber(sumReactions(interactions.reactions))})</span>
            {Object.entries(interactions.reactions)
              .slice(0, Math.min(3, Object.entries(interactions.reactions).length))
              .reverse()
              .map(([reaction], i) => (
                <div key={reaction} className="reaction" style={{ zIndex: i + 1 }}>
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
                  <IconToBeUsed width={18} height={18} className="user-reacted-icon" />
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
        <div className="d-flex justify-content-between align-items-start reactionsModal">
          <h2 className="modalHeading">Comments</h2>
          <button className="closeButton" onClick={() => setShowComments(false)}>
            <IoClose size={24} />
          </button>
        </div>
        {comments?.length && (
          <div className="comments-user-list">
            <div className="modal-title "></div>
            {comments?.map((comment) => (
              <div className="comment-user align-items-start gap-2 justify-content-start">
                <img src={comment?.userProfileImage} alt={`${comment.userName} photo`} />
                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between">
                    <h6>{comment.userName}</h6>
                    <Dropdown className="elipses-wrapper" style={{ height: 10, position: "relative", top: "-15px" }}>
                      <Dropdown.Toggle variant="transparent " className="notButton classicToggle p-0">
                        <FaEllipsisH />
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end" className="dropdownMenu px-3 cp">
                        <button
                          className="d-flex gap-3 align-items-center border-0 bg-transparent rounded p-0"
                          onClick={() => {
                            handleDeleteComment();
                          }}
                        >
                          <FaTrash />
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
                          .slice(0, Math.min(3, Object.entries(comment.reactions).length))
                          .reverse()
                          .map(([reaction], i) => (
                            <div key={reaction} className="reaction" style={{ zIndex: i + 1 }}>
                              {(IconToBeUsed = reactionsIcons[reaction])}
                              <IconToBeUsed width={20} height={20} />
                            </div>
                          ))}
                      </div>
                    )}
                    {comment?.reactions && <span className="ms-1">{formatNumber(sumReactions(comment.reactions))}</span>}
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
