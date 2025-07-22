import React, { useEffect, useState, useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellNoti } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { dateFormat, humanReadable } from "../../Utils/helper";
import { useAuth } from "../../Hooks/useAuth";

const HeaderNotification = ({
  notificationData,
  getNotification,
  viewAllLink,
}) => {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState(notificationData);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Update local state when notificationData prop changes
  useEffect(() => {
    setNotifications(notificationData);
  }, [notificationData]);

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
    }
  };

  const handleNotificationAction = async (val) => {
    try {
      // Find the notification to toggle
      const notificationToToggle = notifications.find((n) => n.id === val);

      if (!notificationToToggle) return;

      // Toggle read_at value based on current state
      const newReadAt =
        notificationToToggle.read_at === null
          ? "2024-06-14T10:42:45.000000Z" // Mark as read
          : null; // Mark as unread

      // Update notifications state
      setNotifications((prevData) =>
        prevData.map((notification) =>
          notification.id === val
            ? { ...notification, read_at: newReadAt }
            : notification
        )
      );

      // In production, uncomment this to make the API call
      // const response = await post(`${apiEndpoint}/${val}`, {
      //   read: notificationToToggle.read_at === null
      // });
    } catch (error) {
      console.error("Error handling notification action:", error);
    }
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
        {notifications.length > 0 && (
          <span className="badge">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="notiMenu" align="end">
        <div className="notificationsBodyHeader">
          <p className="mb-0 fw-bold">Notifications</p>
          <div className="newNotificationCount">
            <p className="mb-0">{notifications.length} new</p>
          </div>
        </div>
        <div className="notificationsBody">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification) => (
              <div
                className={`singleNoti ${
                  notification.read_at === null ? "unread" : ""
                }`}
                key={notification.id}
              >
                <div className="singleNotiIcon">
                  <FontAwesomeIcon className="notiIcon" icon={faBellNoti} />
                </div>
                <div className="singleNotiContent w-100">
                  <h5 className="notiHeading">{notification?.data?.title}</h5>
                  <p className="notiText">{notification?.data?.body}</p>
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
                      {notification.read_at === null
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
