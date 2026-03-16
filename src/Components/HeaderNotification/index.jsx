import React, { useEffect, useState, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellNoti } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { dateFormat, humanReadable } from "../../Utils/helper";
import { useAuth } from "../../Hooks/useAuth";
import { getAll, post } from "../../Services/Api";

const HeaderNotification = ({
    notificationData,
    getNotification,
    viewAllLink,
}) => {
    const { role } = useAuth();
    const [notifications, setNotifications] = useState(notificationData);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Update local state when notificationData prop changes
    useEffect(() => {
        setNotifications(notificationData);
        fetchUnreadCount();
    }, [notificationData]);

    const fetchUnreadCount = async () => {
        try {
            const res = await getAll(`/unread/notification/count`);
            const count = res?.count ?? 0;
            setUnreadCount(count);
        } catch (e) {
            setUnreadCount(0);
        }
    };

    // Add click outside listener to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        // Add event listener when dropdown is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleDropdownToggle = (e) => {
        e.preventDefault(); // Prevent default behavior
        e.stopPropagation(); // Stop event propagation
        setIsOpen(!isOpen); // Toggle dropdown state

        if (!isOpen) {
            // Only fetch notifications when opening the dropdown
            getNotification();
            fetchUnreadCount();
        }
    };

    const handleNotificationAction = async (val) => {
        try {
            // Find the notification to toggle
            const notificationToToggle = notifications.find((n) => n.id === val);

            if (!notificationToToggle) return;

            const isCurrentlyUnread =
                (notificationToToggle.read_at ?? notificationToToggle.read) === null;

            // Call API to toggle
            const endpoint = isCurrentlyUnread
                ? `/notification/read`
                : `/notification/unread`;

            await post(endpoint, { uuid: val });

            // Toggle read_at value locally after API
            const newReadAt = isCurrentlyUnread
                ? new Date().toISOString()
                : null;

            // Update notifications state
            setNotifications((prevData) =>
                prevData.map((notification) =>
                    notification.id === val
                        ? { ...notification, read_at: newReadAt }
                        : notification
                )
            );

            // Refresh unread count
            fetchUnreadCount();
        } catch (error) {
            console.error("Error handling notification action:", error);
        }
    };

    const getNotificationTargetPath = (notification) => {
        const targetType = notification?.target_type;
        const targetId = notification?.target_id;

        if (!targetType || !targetId) return null;

        switch (targetType) {
            case "user":
                return `/admin/user-management/${targetId}`;
            case "doctor":
                return `/admin/doctor-management/${targetId}`;
            case "trainer":
                return `/admin/trainer-management/${targetId}`;
            case "appointment":
                return `/admin/appointments/${targetId}`;
            case "feedback":
                return `/admin/query-management/${targetId}`;
            default:
                return null;
        }
    };

    const handleNotificationClick = async (notification) => {
        const path = getNotificationTargetPath(notification);
        if (!path) return;

        const isCurrentlyUnread =
            (notification.read_at ?? notification.read) === null;

        if (isCurrentlyUnread) {
            try {
                await post(`/notification/read`, { uuid: notification.id });
                setNotifications((prevData) =>
                    prevData.map((n) =>
                        n.id === notification.id
                            ? { ...n, read_at: new Date().toISOString() }
                            : n
                    )
                );
                fetchUnreadCount();
            } catch (e) {
                console.error("Error marking header notification as read:", e);
            }
        }

        setIsOpen(false);
        navigate(path);
    };

    return (
        <Dropdown
            className="notiDropdown me-2 whiteColor"
            show={isOpen}
            ref={dropdownRef}
            onToggle={(isOpen) => {
                // Let the built-in onToggle handle outside clicks
                setIsOpen(isOpen);
                if (isOpen) {
                    getNotification();
                    fetchUnreadCount();
                }
            }}
        >
            <Dropdown.Toggle
                variant="transparent bellIconDropdown border-0 px-0"
                id="notification-dropdown"
                onClick={handleDropdownToggle}
                className="notButton d-flex align-items-center"
            >
                <FontAwesomeIcon className="bellIcon" icon={faBell} color="#fff" />
                <span className="badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="notiMenu" align="end">
                <div className="notificationsBodyHeader">
                    <p className="mb-0 fw-bold">Notifications</p>
                    <div className="newNotificationCount">
                        {unreadCount && <p className="mb-0">{unreadCount} new</p>}
                    </div>
                </div>
                <div className="notificationsBody">
                    {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                            <div
                                className={`singleNoti ${(notification.read_at ?? notification.read) === null ? "unread" : ""
                                    }`}
                                key={notification.id}
                                style={
                                    getNotificationTargetPath(notification)
                                        ? { cursor: "pointer" }
                                        : undefined
                                }
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="singleNotiIcon">
                                    <FontAwesomeIcon className="notiIcon" icon={faBellNoti} />
                                </div>
                                <div className="singleNotiContent w-100">
                                    <h5 className="notiHeading">{notification?.data?.title || notification?.title}</h5>
                                    <p className="notiText">{notification?.data?.body || notification?.message}</p>
                                    <div className="d-flex justify-content-between mt-2">
                                        <p className="d-inline notiDateTime">
                                            {dateFormat(notification?.created_at)} |{" "}
                                            {humanReadable(notification?.created_at)}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleNotificationAction(notification.id);
                                            }}
                                            style={{ fontSize: 12, color: "#999999" }}
                                            className="notButton underlineOnHover"
                                        >
                                            {((notification.read_at ?? notification.read) === null)
                                                ? "Mark as Read"
                                                : "Mark as Unread"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-3">No notifications found</div>
                    )}
                </div>
                <div className="notiFooter text-end pe-4">
                    <Link
                        to={viewAllLink || `/${role}/notifications`}
                        className="underlineOnHover"
                    >
                        view all
                    </Link>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

HeaderNotification.propTypes = {
    notificationData: PropTypes.array.isRequired,
    getNotification: PropTypes.func.isRequired,
    viewAllLink: PropTypes.string,
};

export default HeaderNotification;
