import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Container } from "react-bootstrap";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import {
  FaBars,
  FaDownload,
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaTelegramPlane,
} from "react-icons/fa";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaXmark } from "react-icons/fa6";
import ScrollToBottom from "react-scroll-to-bottom";
import { images } from "../../../Assets";
// import SendIcon from "../../../Assets/images/svg/Send.svg?react";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput/index";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { getAll, post } from "../../../Services/Api";
import { useAuth } from "../../../Hooks/useAuth";
import withModal from "../../../HOC/withModal";
import { usePageTitle } from "../../../Utils/helper";
import Styles from "./chat.module.css";
import "./style.css";

/** Single line for chat bubbles: prefers `created_at`, else combines `date` + `time`. */
function formatChatMessageDateTime(message) {
  if (!message) return "";
  if (message.created_at) {
    const d = new Date(message.created_at);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    }
  }
  const timeStr = (message.time ?? "").trim();
  const dateStr = (message.date ?? "").trim();
  if (timeStr && dateStr) {
    const paddedTime = /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)
      ? timeStr.length <= 5
        ? `${timeStr}:00`
        : timeStr
      : timeStr;
    let d = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      d = new Date(`${dateStr}T${paddedTime}`);
    } else {
      const m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(dateStr);
      if (m) {
        const [, day, month, year] = m;
        d = new Date(
          `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${paddedTime}`,
        );
      }
    }
    if (d && !Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    }
    return `${dateStr}, ${timeStr}`;
  }
  return timeStr || dateStr || "";
}

const CHAT_SOCKET_URL =
  (typeof process !== "undefined" && process.env.REACT_APP_CHAT_SOCKET_URL) ||
  "https://custom-dev.onlinetestingserver.com:2170";

/** Append socket/API message if not already in list (match by id). */
function mergeChatMessage(prev, incoming) {
  if (!incoming || typeof incoming !== "object") return prev;
  const id = incoming.id;
  if (id != null && prev.some((m) => m?.id === id)) return prev;
  return [...prev, incoming];
}

function pickFirstId(obj, keys) {
  if (!obj || typeof obj !== "object") return null;
  for (const k of keys) {
    const v = obj[k];
    if (v != null && v !== "") return v;
  }
  return null;
}

/** Sender id from socket/API payloads (field names vary by emitter). */
function getMessageSenderId(message) {
  if (!message || typeof message !== "object") return null;
  const direct = pickFirstId(message, [
    "sender_id",
    "senderId",
    "sendable_id",
    "user_id",
    "user-id",
    "from_id",
    "from_user_id",
    "sender_user_id",
  ]);
  if (direct != null) return direct;
  const nested =
    message.sender?.id ??
    message.user?.id ??
    message.from?.id ??
    message.sender?.user_id;
  if (nested != null) return nested;
  return null;
}

function getLoggedInUserId(user) {
  if (!user || typeof user !== "object") return null;
  return pickFirstId(user, ["id", "user_id", "user-id", "userId"]);
}

function getOtherPartyUserId(chat) {
  if (!chat || typeof chat !== "object") return null;
  return pickFirstId(chat, [
    "doctor_id",
    "trainer_id",
    "user_id",
    "receiver_id",
    "doctorId",
    "trainerId",
    "participant_id",
    "other_user_id",
  ]);
}

/**
 * Socket events often omit or mis-set `is_mine`. Prefer comparing sender id to
 * the admin user, or to the chat's other party (doctor), matching `/chat/getChat` behavior.
 */
function normalizeSocketChatMessage(message, adminUser, activeChat) {
  if (!message || typeof message !== "object") return message;
  const senderId = getMessageSenderId(message);
  if (senderId == null) {
    return { ...message, is_mine: Boolean(message.is_mine) };
  }
  const adminId = getLoggedInUserId(adminUser);
  if (adminId != null && adminId !== "") {
    const isMine = Number(senderId) === Number(adminId);
    return { ...message, is_mine: isMine };
  }
  const otherId = getOtherPartyUserId(activeChat);
  if (otherId != null && otherId !== "") {
    const isMine = Number(senderId) !== Number(otherId);
    return { ...message, is_mine: isMine };
  }
  return { ...message, is_mine: Boolean(message.is_mine) };
}

/** Match chat list row to doctor or trainer id (API field names vary). */
function chatMatchesParticipant(chat, participantId) {
  if (chat == null || participantId == null || participantId === "")
    return false;
  const d = String(participantId);
  const keys = [
    "doctor_id",
    "trainer_id",
    "user_id",
    "receiver_id",
    "doctorId",
    "trainerId",
    "participant_id",
    "other_user_id",
  ];
  return keys.some((k) => chat[k] != null && String(chat[k]) === d);
}

const Chat = ({ showModal }) => {
  const { user: authUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [sideData, setSideData] = useState([]);
  const [chatBox, setChatBox] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState([]); // For images
  const [documentFiles, setDocumentFiles] = useState([]); // For Word, Excel, PDF
  const [chatFilter, setChatFilter] = useState("all");
  /** Deep link: doctor has no thread yet (could not open / create chat). */
  const [pendingDoctorProfile, setPendingDoctorProfile] = useState(null);

  const socketRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const activeChatRef = useRef(null);
  const authUserRef = useRef(null);
  const fetchChatListRef = useRef(null);
  const pendingDoctorProfileRef = useRef(null);
  pendingDoctorProfileRef.current = pendingDoctorProfile;
  activeChatRef.current = activeChat;
  authUserRef.current = authUser;

  const clearChatDeepLinkParams = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("doctorId");
        next.delete("chatId");
        next.delete("doctorName");
        next.delete("trainerId");
        next.delete("trainerName");
        return next;
      },
      { replace: true },
    );
  };

  // Load chat list and messages
  const fetchChatList = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (chatFilter !== "all") params.status = chatFilter; // read | unread
      const res = await getAll(`/chat/getChatList`, params);
      const list = res?.data ?? [];
      setSideData(list);

      const doctorId = searchParams.get("doctorId");
      const trainerId = searchParams.get("trainerId");
      const chatIdParam = searchParams.get("chatId");
      const doctorName = searchParams.get("doctorName") || "";
      const trainerName = searchParams.get("trainerName") || "";
      const participantId = doctorId || trainerId;
      const participantName = doctorName || trainerName;

      let preferred = null;
      if (chatIdParam) {
        preferred = list.find((c) => String(c.id) === String(chatIdParam));
      } else if (participantId) {
        preferred = list.find((c) =>
          chatMatchesParticipant(c, participantId),
        );
      }

      if (preferred) {
        setActiveChat(preferred);
        setPendingDoctorProfile(null);
        clearChatDeepLinkParams();
        return;
      }

      if (participantId || chatIdParam) {
        clearChatDeepLinkParams();

        let resolvedFromApi = null;
        if (participantId) {
          try {
            const createBody = trainerId
              ? { trainer_id: trainerId }
              : { doctor_id: doctorId };
            const createRes = await post(`/chat/get-or-create`, createBody);
            const raw = createRes?.data;
            const row = raw?.chat ?? raw?.data ?? raw;
            if (row?.id) resolvedFromApi = row;
          } catch (e) {
            /* backend may not expose this route yet */
          }
        }

        if (resolvedFromApi) {
          setSideData((prev) => {
            if (prev.some((c) => String(c.id) === String(resolvedFromApi.id)))
              return prev;
            return [resolvedFromApi, ...prev];
          });
          setActiveChat(resolvedFromApi);
          setPendingDoctorProfile(null);
          setChatBox([]);
          return;
        }

        setActiveChat(null);
        setChatBox([]);
        if (participantId) {
          setPendingDoctorProfile({
            doctorId: participantId,
            doctorName: participantName,
            isTrainer: Boolean(trainerId),
          });
        } else {
          setPendingDoctorProfile(null);
        }
        return;
      }

      setActiveChat((current) => {
        if (current) return current;
        if (pendingDoctorProfileRef.current) return null;
        return list[0] ?? null;
      });
      if (!pendingDoctorProfileRef.current) setPendingDoctorProfile(null);
    } catch (e) {
      setSideData([]);
    }
  };

  fetchChatListRef.current = fetchChatList;

  const fetchChat = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await getAll(`/chat/getChat/${chatId}`);
      setChatBox(res?.data ?? []);
    } catch (e) {
      setChatBox([]);
    }
  };

  useEffect(() => {
    fetchChatList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchChatList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, chatFilter]);

  useEffect(() => {
    if (activeChat?.id) fetchChat(activeChat.id);
  }, [activeChat?.id]);

  useEffect(() => {
    activeChatIdRef.current = activeChat?.id ?? null;
  }, [activeChat?.id]);

  useEffect(() => {
    const socket = io(CHAT_SOCKET_URL, {
      transports: ["websocket"],
      path: "/socket.io/",
    });
    socketRef.current = socket;

    const onReceiveMessage = (data) => {
      const chatId = data?.chat_id ?? data?.chatId;
      if (chatId == null || Number(chatId) !== Number(activeChatIdRef.current))
        return;
      const normalized = normalizeSocketChatMessage(
        data,
        authUserRef.current,
        activeChatRef.current,
      );
      setChatBox((prev) => mergeChatMessage(prev, normalized));
    };

    const onUpdateChatList = () => {
      fetchChatListRef.current?.();
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("updateChatList", onUpdateChatList);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("updateChatList", onUpdateChatList);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  usePageTitle("Chat");
  const handleUserClick = (chat) => {
    setPendingDoctorProfile(null);
    setActiveChat(chat);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // For image uploads
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf":
        return <FaFilePdf size={20} color="#E74C3C" />;
      case "doc":
      case "docx":
        return <FaFileWord size={20} color="#2E86C1" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={20} color="#27AE60" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint size={20} color="#E67E22" />;
      case "txt":
        return <FaFileAlt size={20} color="#666" />;
      case "zip":
      case "rar":
        return <FaFileArchive size={20} color="#7D3C98" />;
      default:
        return <FaFile size={20} color="#666" />;
    }
  };

  const PermissionToShare = () => {
    showModal(
      ``,
      `Permission Granted to user to share file successfully.`,
      null,
      true,
    );
  };

  const UserRestricted = () => {
    showModal(``, `User restricted to message Successfully.`, null, true);
  };

  const BlockedUser = () => {
    showModal(``, `User Blocked Successfully.`, null, true);
  };

  // For document uploads
  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validFiles = files.filter(
      (file) =>
        allowedTypes.includes(file.type) ||
        file.name.match(/\.(pdf|doc|docx|xls|xlsx)$/i),
    );

    if (validFiles.length !== files.length) {
      alert(
        "Only PDF, Word (.doc, .docx), Excel (.xls, .xlsx) files are allowed",
      );
    }

    if (validFiles.length > 0) {
      setDocumentFiles((prev) => [...prev, ...validFiles]);
    }

    e.target.value = ""; // Reset input
  };

  const handleSend = async () => {
    if (!activeChat?.id) return;
    if (!messageInput && imageFiles.length < 1 && documentFiles.length < 1)
      return;
    try {
      const files = [...imageFiles, ...documentFiles];
      const res = await post(`/chat/sendMessage`, {
        chat_id: activeChat.id,
        message: messageInput,
        files,
      });
      const newMsg = res?.data;
      if (newMsg) {
        setChatBox((prev) => mergeChatMessage(prev, newMsg));
        const sk = socketRef.current;
        if (sk?.connected) {
          sk.emit("sendMessage", { chat_id: activeChat.id, ...newMsg });
        }
      }
      setMessageInput("");
      setImageFiles([]);
      setDocumentFiles([]);
      fetchChatList();
    } catch (e) {}
  };

  return (
    <DashboardLayout>
      <section className={"adminDashCard"}>
        <Container fluid className="">
          <div className="">
            <div className="site_card p-0 ">
              <h2 className="fw-bold pt-3 mb-3 mainTitle">Chats</h2>
              <div
                className={`d-flex justify-content-between align-items-center mb-xl-0 mb-3`}
              >
                <button
                  className={`${Styles[`sidebar-toggle`]} ${Styles[`chatToggleButton`]}`}
                  onClick={toggleSidebar}
                >
                  <FaBars />
                </button>
              </div>
              <div className={`${Styles[`chat-module`]}`}>
                <div
                  className={`${Styles[`chat-sidebar`]} ${isSidebarOpen ? `${Styles.open}` : ``}`}
                >
                  <button
                    className={`d-xl-none d-block ${Styles.sidebarCloseBtn}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaXmark />
                  </button>
                  <div
                    className={`d-flex align-items-center gap-2 px-2 ${Styles[`chat-sidebar-top`]}`}
                  >
                    <div className="chat-search flex-grow-1">
                      <CustomInput
                        type="text"
                        placeholder="Search..."
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className="searchButton notButton">
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                  <div className="px-2 pb-3" style={{ background: "#333" }}>
                    <div className="d-flex justify-content-center gap-2">
                      <CustomButton
                        onClick={() => {
                          setChatFilter("all");
                        }}
                        className={`btn min-width-120 ${chatFilter === "all" ? "btn-primary" : "btn-secondary"}`}
                        text="All"
                      />
                      <CustomButton
                        onClick={() => {
                          setChatFilter("read");
                        }}
                        text="Read"
                        className={`btn min-width-120 ${chatFilter === "read" ? "btn-primary" : "btn-secondary"}`}
                      />
                      <CustomButton
                        onClick={() => {
                          setChatFilter("unread");
                        }}
                        text="Unread"
                        className={`btn min-width-120 ${chatFilter === "unread" ? "btn-primary" : "btn-secondary"} `}
                      />
                    </div>
                  </div>
                  <ul>
                    {sideData?.map((chat, index) => (
                      <div
                        className={`${Styles.sidebarChat} ${activeChat?.id === chat.id ? `isOpen` : `close`}`}
                        key={chat.id}
                        onClick={() => handleUserClick(chat)}
                      >
                        <div className={`flex-shrink-0`}>
                          <img
                            src={chat.image}
                            alt={index}
                            className={Styles.chatHeaderImg}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                images.adminProfileImg ||
                                images.adminProfileImg;
                            }}
                          />
                        </div>
                        <div className={`flex-grow-1 ${Styles.sidebarContent}`}>
                          <h6 className={`mb-0 text-white ${Styles.sidebarName}`}>
                            {chat.name}
                          </h6>
                          <p className={`mb-0 ${Styles.sidebarLastMessage}`}>
                            {chat?.last_message?.message}
                          </p>
                        </div>
                        <div className={Styles.sidebarMeta}>
                          <p
                            className={`img-fluid ${Styles["noti-tag-time"]} mb-0`}
                          >
                            {chat?.last_message?.time}
                          </p>
                          {chat.unread > 0 && (
                            <span className={`${Styles.chatBadge} ms-auto`}>
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>

                <div className={`${Styles["chat-area"]}`}>
                  {activeChat ? (
                    <div className={`${Styles["chat-window"]}`}>
                      <header
                        className={`${Styles.chatHeader} gap-3 ps-4 py-3`}
                      >
                        <div className="d-flex align-items-center flex-wrap gap-3 justify-content-between">
                          <div className="d-flex gap-3 align-items-center">
                            <div className="flex-shrink-0">
                              <img
                                src={activeChat?.image || images.UserImage}
                                alt=""
                                className="user-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    images.adminProfileImg ||
                                    images.adminProfileImg;
                                }}
                              />
                            </div>
                            <div className="flex-grow-1 align-self-center">
                              <h4 className="fw-medium">
                                {activeChat?.name || "Chat"}
                              </h4>
                              {/* <h6 className="mb-0">
                                                                <span style={{ color: "#00B207" }}>●</span> Active Now
                                                            </h6> */}
                            </div>
                          </div>
                        </div>
                      </header>

                      <div className={Styles.messages}>
                        <ScrollToBottom className={Styles.messages}>
                          {chatBox.map((message, index) => (
                            <div
                              key={index}
                              className={`${Styles["message-box"]}  ${
                                message?.is_mine
                                  ? Styles["my-message"]
                                  : Styles["other-message"]
                              }`}
                            >
                              <div
                                className={`flex-grow-1 ${Styles["message-column"]}`}
                              >
                                {/* <div className={`${Styles["user-name"]}`}>
                                                                    <h6 className={`mb-2`}>{message?.user_name || message?.name || "User"}</h6>
                                                                </div> */}
                                <div className={`${Styles.message}`}>
                                  {message.message && (
                                    <p className={``}>{message?.message}</p>
                                  )}
                                  {message.images &&
                                    message.images.map((file, index) => (
                                      <div
                                        className={`my-3 ${Styles.uploadImg}`}
                                        key={`img-${index}`}
                                      >
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt={`Uploaded File`}
                                        />
                                      </div>
                                    ))}
                                  {message.documents &&
                                    message.documents.map((doc, index) => (
                                      <div
                                        className={`my-3 ${Styles.documentItem}`}
                                        key={`doc-${index}`}
                                      >
                                        <div className="d-flex flex-wrap gap-2 align-items-start justify-content-between p-sm-2 p-1 bg-light rounded">
                                          <div className="d-flex align-items-start gap-1">
                                            <div>{getFileIcon(doc.name)}</div>
                                            <div className="">
                                              <h6 className="text-dark text-break fw-semibold mb-0">
                                                {doc.name}
                                              </h6>
                                              <div className="text-muted small">
                                                {(doc.size / 1024).toFixed(1)}{" "}
                                                KB
                                              </div>
                                            </div>
                                          </div>
                                          <a
                                            href={URL.createObjectURL(doc)}
                                            download={doc.name}
                                            className={`documentDownloadBtn`}
                                          >
                                            <FaDownload />
                                          </a>
                                        </div>
                                      </div>
                                    ))}
                                  {message.file &&
                                    message.file.map((f, idx) => (
                                      <div
                                        className={`my-3 ${Styles.uploadImg}`}
                                        key={`api-file-${idx}`}
                                      >
                                        {f.path?.match(
                                          /\.(jpg|jpeg|png|gif|webp)$/i,
                                        ) ? (
                                          <img src={f.path} alt="attachment" />
                                        ) : (
                                          <a
                                            href={f.path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`documentDownloadBtn`}
                                          >
                                            <FaDownload />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  <div
                                    className={`d-flex justify-content-end align-items-center flex-wrap gap-3`}
                                  >
                                    {
                                      <div
                                        className={`d-flex gap-2 align-items-center flex-wrap`}
                                      >
                                        <div
                                          className={`d-flex align-items-center gap-2`}
                                        >
                                          <p className={`mb-0 message-date`}>
                                            {formatChatMessageDateTime(message)}
                                          </p>
                                          {message?.is_mine && (
                                            <p className={`mb-0`}>
                                              {message?.seen ? (
                                                <BiCheckDouble
                                                  size={25}
                                                  color="#53A6EC"
                                                />
                                              ) : (
                                                <BiCheck
                                                  size={24}
                                                  color="#666"
                                                />
                                              )}
                                            </p>
                                          )}{" "}
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`flex-shrink-0 ${Styles["avatar-column"]}`}
                              >
                                <div className={`${Styles.messageAvatar}`}>
                                  {(message?.picture ||
                                    message?.["photo-path"] ||
                                    message?.image) && (
                                    <img
                                      src={
                                        message.picture ||
                                        message?.["photo-path"] ||
                                        message?.image ||
                                        images.UserImage
                                      }
                                      alt={message.name || "User"}
                                      className={`${Styles.messageAvatar}`}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          images.adminProfileImg ||
                                          images.adminProfileImg;
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </ScrollToBottom>
                      </div>

                      {/* Image previews */}
                      {imageFiles.length > 0 && (
                        <div className={imageFiles ? Styles.uploadedFiles : ``}>
                          {imageFiles.map((file, index) => (
                            <div
                              key={`preview-img-${index}`}
                              className={`${Styles.isFileVisible}`}
                            >
                              <div className={`${Styles.fileVisible}`}>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="Preview"
                                  className="img-fluid"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = images.adminProfileImg;
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    setImageFiles((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    )
                                  }
                                  className={`${Styles.deleteBtn}`}
                                >
                                  <FaXmark />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Document previews */}
                      {documentFiles.length > 0 && (
                        <ul className="uploaded-file-list mb-0 mt-2 px-sm-3 px-2">
                          {documentFiles.map((file, index) => (
                            <li
                              key={index}
                              className="uploaded-file-item d-flex gap-2 align-items-center"
                              style={{ listStyle: "none" }}
                            >
                              <div className="d-flex align-items-center">
                                {getFileIcon(file.name)}
                                <span className="file-name ms-1">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  setDocumentFiles((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  )
                                }
                                className={`${Styles.documentDeleteBtn}`}
                              >
                                <FaXmark />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className={`${Styles["input-area"]}`}>
                        <input
                          type="text"
                          placeholder="Type A Message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <div className={`${Styles["input-area-inner"]}`}>
                          <div className={`${Styles.fileUpload}`}>
                            <label htmlFor={`uploader`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                viewBox="0 0 46 38"
                                fill="none"
                              >
                                <path
                                  d="M41.9243 8.00492H41.5352C41.3073 6.05261 39.7362 4.50471 37.7727 4.31526C37.5473 2.21056 35.7619 0.565674 33.5986 0.565674H6.80727C3.22177 0.565674 0.304688 3.48276 0.304688 7.0679V25.8528C0.304688 28.0313 1.97173 29.8268 4.09647 30.0322C4.31951 32.1144 6.06998 33.7453 8.20208 33.7796C8.20685 34.1401 8.26352 34.498 8.37033 34.8424C8.84788 36.3754 10.2808 37.4915 11.969 37.4915H41.9243C44.0025 37.4915 45.693 35.8009 45.693 33.7232V11.7736C45.693 9.69546 44.0025 8.00492 41.9243 8.00492ZM43.92 11.7736V26.2888L40.0638 23.3758C39.01 22.5801 37.5852 22.5676 36.5178 23.345L31.6397 26.8993L22.3371 17.3086C21.229 16.1659 19.4258 16.0956 18.2322 17.149L9.97364 24.435V11.7736C9.97364 10.6731 10.8688 9.7779 11.969 9.7779H41.9243C43.0248 9.7779 43.92 10.6731 43.92 11.7736ZM43.92 33.7228C43.92 34.8233 43.0248 35.7185 41.9247 35.7185H11.969C11.0752 35.7185 10.3165 35.1274 10.0637 34.3157C10.0039 34.1239 9.97349 33.9241 9.97364 33.7232V26.7992L19.4055 18.4783C19.6371 18.2733 19.9388 18.1655 20.2479 18.1775C20.557 18.1896 20.8495 18.3204 21.0645 18.5427L25.2629 22.8713C25.2629 22.8716 25.2629 22.8716 25.2632 22.8716L33.6194 31.4869C33.702 31.5723 33.8009 31.6402 33.9102 31.6865C34.0196 31.7327 34.1372 31.7565 34.2559 31.7563C34.4782 31.7563 34.7009 31.6732 34.8729 31.5063C35.2241 31.1652 35.2328 30.6042 34.892 30.2527L32.8863 28.1847L37.5618 24.7783C37.9934 24.4639 38.5692 24.4687 38.9951 24.7904L43.92 28.5105V33.7228ZM5.84525 29.5823V8.65135C5.84525 8.56244 5.84968 8.47405 5.85873 8.38753C5.99108 7.0867 7.09325 6.06812 8.42857 6.06812H19.2721C19.7617 6.06812 20.1586 5.67133 20.1586 5.18163C20.1586 4.69202 19.7617 4.29514 19.2721 4.29514H8.42848C6.02636 4.29514 4.07227 6.24923 4.07227 8.65135V28.2408C2.9396 28.0369 2.07767 27.0437 2.07767 25.8528V7.0679C2.07767 4.46038 4.19939 2.33865 6.80727 2.33865H33.5986C34.7753 2.33865 35.7591 3.18117 35.9783 4.29514H26.364C25.8743 4.29514 25.4776 4.69202 25.4776 5.18163C25.4776 5.67133 25.8743 6.06812 26.364 6.06812H37.3662C38.5359 6.06812 39.5151 6.90098 39.742 8.00492H11.969C9.89128 8.00492 8.20066 9.69546 8.20066 11.7736V32.0066C6.89557 31.9696 5.84525 30.8965 5.84525 29.5823Z"
                                  fill="#A3A3A3"
                                />
                                <path
                                  d="M34.7522 13.3857C32.66 13.3857 30.9583 15.0877 30.9583 17.1792C30.9583 19.2711 32.6603 20.9731 34.7522 20.9731C36.8437 20.9731 38.5458 19.2711 38.5458 17.1792C38.5458 15.0876 36.8437 13.3857 34.7522 13.3857ZM34.7522 19.2001C33.6379 19.2001 32.7313 18.2935 32.7313 17.1796C32.7313 16.0652 33.6378 15.1586 34.7522 15.1586C35.8662 15.1586 36.7728 16.0652 36.7728 17.1796C36.7728 18.2935 35.8662 19.2001 34.7522 19.2001ZM22.0058 5.5208C22.0279 5.57416 22.0554 5.6254 22.0871 5.67354C22.1193 5.72199 22.1562 5.76713 22.1973 5.80828C22.2381 5.8488 22.2831 5.88621 22.3321 5.9191C22.429 5.98319 22.5373 6.02798 22.6512 6.05101C22.7656 6.0737 22.8834 6.0737 22.9978 6.05101C23.0544 6.03957 23.1094 6.02264 23.1634 6.00048C23.2168 5.97827 23.268 5.95102 23.3162 5.9191C23.3644 5.88638 23.4095 5.84929 23.4509 5.80828C23.4922 5.76714 23.5293 5.72201 23.5617 5.67354C23.5936 5.6254 23.6209 5.57416 23.643 5.5208C23.6652 5.46681 23.6822 5.41105 23.6935 5.35529C23.716 5.24084 23.716 5.12312 23.6935 5.00867C23.6822 4.95186 23.6653 4.8963 23.643 4.84281C23.599 4.73481 23.5336 4.63681 23.4508 4.5547C23.4097 4.51363 23.3645 4.47674 23.3161 4.4446C23.2679 4.41268 23.2168 4.38543 23.1634 4.36322C23.1094 4.34105 23.0544 4.32403 22.9979 4.31269C22.8835 4.28949 22.7657 4.28949 22.6513 4.31269C22.5374 4.33569 22.4289 4.38048 22.332 4.4446C22.2832 4.47678 22.2382 4.51383 22.1972 4.5547C22.1563 4.59557 22.1194 4.6406 22.0871 4.68945C22.055 4.73775 22.0277 4.78912 22.0058 4.84281C21.9835 4.8963 21.9666 4.95186 21.9552 5.00867C21.9436 5.06556 21.9377 5.12347 21.9375 5.18154C21.9375 5.23898 21.9438 5.29749 21.9552 5.35529C21.9668 5.41114 21.9836 5.46681 22.0058 5.5208Z"
                                  fill="#A3A3A3"
                                />
                              </svg>
                            </label>
                            <input
                              type={`file`}
                              id={`uploader`}
                              onChange={handleImageChange}
                              accept="image/*"
                              multiple
                              hidden={true}
                            />
                          </div>
                          <div className="file-upload mt-2">
                            <label
                              htmlFor="doc-uploader"
                              className="upload-label"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 39 40"
                                fill="none"
                              >
                                <g clip-path="url(#clip0_435_42258)">
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M35 34.0726C35 35.4056 34.4697 36.6856 33.528 37.6292C32.5841 38.5712 31.3051 39.1006 29.9714 39.1012H8.02857C6.69554 39.1012 5.41554 38.5709 4.472 37.6292C3.52991 36.6852 3.00056 35.4062 3 34.0726V4.81544C3 3.48241 3.53029 2.20241 4.472 1.25887C5.41595 0.316777 6.69494 -0.212575 8.02857 -0.213135H23.7287C24.5771 -0.213135 25.3909 0.123322 25.9906 0.724922L34.0619 8.79624C34.6635 9.39601 35 10.2097 35 11.0582V34.0726ZM32.2571 34.0726V11.0582C32.2572 10.9981 32.2455 10.9386 32.2226 10.8831C32.1997 10.8275 32.1661 10.7771 32.1237 10.7345L24.0523 2.66321C24.0098 2.62078 23.9593 2.58716 23.9038 2.56425C23.8483 2.54135 23.7888 2.52962 23.7287 2.52972H8.02857C7.42266 2.53069 6.84184 2.77182 6.4134 3.20026C5.98495 3.62871 5.74382 4.20952 5.74286 4.81544V34.0726C5.74382 34.6785 5.98495 35.2593 6.4134 35.6878C6.84184 36.1162 7.42266 36.3573 8.02857 36.3583H29.9714C30.5773 36.3573 31.1582 36.1162 31.5866 35.6878C32.015 35.2593 32.2562 34.6785 32.2571 34.0726Z"
                                    fill="#A3A3A3"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M23.1125 2.0726C23.1125 1.70887 23.257 1.36005 23.5142 1.10285C23.7714 0.845661 24.1202 0.701172 24.4839 0.701172C24.8477 0.701172 25.1965 0.845661 25.4537 1.10285C25.7109 1.36005 25.8554 1.70887 25.8554 2.0726V8.4726C25.8554 8.72494 26.0602 8.92974 26.3125 8.92974H32.7125C33.0762 8.92974 33.4251 9.07423 33.6822 9.33142C33.9394 9.58862 34.0839 9.93745 34.0839 10.3012C34.0839 10.6649 33.9394 11.0137 33.6822 11.2709C33.4251 11.5281 33.0762 11.6726 32.7125 11.6726H26.3125C25.4638 11.6726 24.6499 11.3355 24.0498 10.7353C23.4496 10.1352 23.1125 9.32129 23.1125 8.4726V2.0726ZM11.6839 18.0726C11.3202 18.0726 10.9714 17.9281 10.7142 17.6709C10.457 17.4137 10.3125 17.0649 10.3125 16.7012C10.3125 16.3374 10.457 15.9886 10.7142 15.7314C10.9714 15.4742 11.3202 15.3297 11.6839 15.3297H26.3125C26.6762 15.3297 27.0251 15.4742 27.2822 15.7314C27.5394 15.9886 27.6839 16.3374 27.6839 16.7012C27.6839 17.0649 27.5394 17.4137 27.2822 17.6709C27.0251 17.9281 26.6762 18.0726 26.3125 18.0726H11.6839ZM11.6839 24.4726C11.3202 24.4726 10.9714 24.3281 10.7142 24.0709C10.457 23.8137 10.3125 23.4649 10.3125 23.1012C10.3125 22.7374 10.457 22.3886 10.7142 22.1314C10.9714 21.8742 11.3202 21.7297 11.6839 21.7297H26.3125C26.6762 21.7297 27.0251 21.8742 27.2822 22.1314C27.5394 22.3886 27.6839 22.7374 27.6839 23.1012C27.6839 23.4649 27.5394 23.8137 27.2822 24.0709C27.0251 24.3281 26.6762 24.4726 26.3125 24.4726H11.6839ZM11.6839 30.8726C11.3202 30.8726 10.9714 30.7281 10.7142 30.4709C10.457 30.2137 10.3125 29.8649 10.3125 29.5012C10.3125 29.1374 10.457 28.7886 10.7142 28.5314C10.9714 28.2742 11.3202 28.1297 11.6839 28.1297H19.9125C20.2762 28.1297 20.6251 28.2742 20.8822 28.5314C21.1394 28.7886 21.2839 29.1374 21.2839 29.5012C21.2839 29.8649 21.1394 30.2137 20.8822 30.4709C20.6251 30.7281 20.2762 30.8726 19.9125 30.8726H11.6839Z"
                                    fill="#A3A3A3"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_435_42258">
                                    <rect
                                      width="38.6862"
                                      height="38.6862"
                                      fill="white"
                                      transform="translate(0.117188 0.596924)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </label>
                            <input
                              type="file"
                              id="doc-uploader"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              multiple
                              hidden
                              onChange={handleDocumentChange}
                            />
                          </div>
                          <button
                            className={`${Styles["send-btn"]}`}
                            disabled={
                              !(
                                messageInput ||
                                imageFiles.length ||
                                documentFiles.length
                              )
                            }
                            onClick={handleSend}
                          >
                            {/* <SendIcon /> */}
                            <FaTelegramPlane color="#118076" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : pendingDoctorProfile ? (
                    <div
                      className={`${Styles["no-chat-selected"]} d-flex flex-column align-items-center justify-content-center text-center px-4`}
                    >
                      <h4 className="fw-medium mb-3">
                        {pendingDoctorProfile.doctorName
                          ? `No chat with ${pendingDoctorProfile.doctorName} yet`
                          : pendingDoctorProfile?.isTrainer
                            ? "No chat with this trainer yet"
                            : "No chat with this doctor yet"}
                      </h4>
                    </div>
                  ) : (
                    <div className={`${Styles["no-chat-selected"]}`}>
                      Select a user to start chat
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </DashboardLayout>
  );
};

export default withModal(Chat);
