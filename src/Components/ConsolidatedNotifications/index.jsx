import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { notificationOptions } from "../../Config/TableStatus";
import withPagination from "../../HOC/withPagination";
import { dateFormat, humanReadable } from "../../Utils/helper";
import LoadingSpinner from "../Loader";
import NotificationCard from "../NotificationCard";
import { Select } from "../Select";
import "./style.css";
import { useAuth } from "../../Hooks/useAuth";
import { getAll, post } from "../../Services/Api";
import CustomPagination from "../CustomPagination";
import { useNavigate } from "react-router-dom";

const ConsolidatedNotifications = ({
  apiEndpoint,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { role } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const params = { ...filters };
      if (selectedStatus) params.status = selectedStatus; // read | unread

      const responses = await getAll(`${apiEndpoint}`, params);

      // API expected shape: { data: [...], meta: { current_page, per_page, total, to } }
      const list = responses?.data ?? [];
      const meta = responses?.meta ?? {};

      setNotifications(list);
      updatePagination({
        showData: meta.to ?? list.length,
        currentPage: meta.current_page ?? filters.page,
        totalRecords: meta.total ?? list.length,
        totalPages:
          meta.last_page ??
          Math.ceil(
            (meta.total ?? list.length) / (meta.per_page ?? filters.per_page),
          ),
        perPage: meta.per_page ?? filters.per_page,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedStatus]);

  const handleNotificationAction = async (val) => {
    try {
      const target = notifications.find((n) => n.id === val);
      if (!target) return;
      const unread = (target.read_at ?? target.read) === null;
      const endpoint = unread ? `/notification/read` : `/notification/unread`;
      await post(endpoint, { uuid: val });
      // Update UI optimistically
      setNotifications((prevData) =>
        prevData.map((n) =>
          n.id === val
            ? { ...n, read_at: unread ? new Date().toISOString() : null }
            : n,
        ),
      );
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

  const handleNotificationNavigate = async (notificationId) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification) return;

    const path = getNotificationTargetPath(notification);
    if (!path) return;

    // Mark as read if currently unread
    const isUnread = (notification.read_at ?? notification.read) === null;
    if (isUnread) {
      try {
        await post(`/notification/read`, { uuid: notificationId });
        setNotifications((prevData) =>
          prevData.map((n) =>
            n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n,
          ),
        );
      } catch (e) {
        console.error("Error marking notification as read on navigate:", e);
      }
    }

    navigate(path);
  };

  const markAllRead = async () => {
    try {
      await post(`/notification/all/read`);
      // Refresh list
      fetchNotifications();
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  };

  // console.log(notifications)

  return (
    <div className={role == "user" && "py-sm-5 py-3"}>
      <div className="site_card">
        <Row className="mb-4">
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-sm-4 ">
              <div>
                <Select
                  className="slimSelect"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  label="Show"
                  labelclass="pe-3"
                >
                  {notificationOptions}
                </Select>
              </div>
              {role == "user" && (
                <div>
                  <h2 className="page-title fw-bold mb-0">Notifications</h2>
                </div>
              )}
              <div>
                <button className="mark_all_btn" onClick={markAllRead}>
                  Mark All as Read
                </button>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {loading ? (
              <LoadingSpinner />
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <NotificationCard
                    id={notification.id}
                    /* Support both old mock structure and new API fields */
                    text={notification?.data?.body || notification?.message}
                    name={notification?.data?.title || notification?.title}
                    date={dateFormat(notification?.created_at)}
                        time={humanReadable(notification?.created_at)}
                    read={
                      notification?.read_at !== undefined
                        ? notification?.read_at
                        : (notification?.read ?? null)
                    }
                    notiRead={
                      notification?.read_at !== undefined
                        ? notification?.read_at
                        : (notification?.read ?? null)
                    }
                    clickable={!!getNotificationTargetPath(notification)}
                    onToggleRead={handleNotificationAction}
                    onNavigate={handleNotificationNavigate}
                  />
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-3">No notifications found</div>
            )}
          </Col>
        </Row>
        {/* Pagination */}
        <Row>
          <Col xs={12} className="mt-3">
            {pagination && pagination.totalRecords > 0 && (
              <CustomPagination
                pagination={pagination}
                setFilters={setFilters}
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withPagination(ConsolidatedNotifications);
