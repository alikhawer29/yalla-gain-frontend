import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { notificationsData } from "../../Config/data";
import { notificationOptions } from "../../Config/TableStatus";
import withPagination from "../../HOC/withPagination";
import { dateFormat, humanReadable } from "../../Utils/helper";
import CustomButton from "../CustomButton";
import LoadingSpinner from "../Loader";
import NotificationCard from "../NotificationCard";
import { Select } from "../Select";
import "./style.css";
import { useAuth } from "../../Hooks/useAuth";

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

  const fetchNotifications = async () => {
    try {
      const responses = notificationsData;

      // const responses = await getAll(`${apiEndpoint}${selectedStatus ? `?status=${selectedStatus}` : ""}`, filters);
      const { data, total, per_page, current_page, to } =
        responses?.detail?.notifications;
      setNotifications(data);
      updatePagination({
        showData: to,
        currentPage: current_page,
        totalRecords: total,
        totalPages: Math.ceil(total / per_page),
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
      // const response = await post(`${apiEndpoint}/${val}`);
      // const  {data} = notificationsData?.detail?.notifications;

      setNotifications((prevData) =>
        prevData.map((notification) =>
          notification.id === val
            ? { ...notification, read_at: "2024-06-14T10:42:45.000000Z" }
            : notification
        )
      );

      // if (response) {
      //   fetchNotifications();
      // }
    } catch (error) {
      console.error("Error handling notification action:", error);
    }
  };

  // console.log(notifications)

  return (
    <div className={role == "user" && 'py-sm-5 py-3'}>
      <div className="site_card">
        <Row className="mb-4">
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-sm-4 ">
              <div>
                <Select
                  className="slimSelect"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  label="Showing"
                  labelclass="pe-3"
                >
                  {notificationOptions}
                </Select>
              </div>
              {role== "user" && (
              <div>
                <h2 className="page-title fw-bold mb-0">Notifications</h2>
              </div>
              )}
              <div>
                <button
                  className="mark_all_btn"
                  onClick={() => {
                    console.log("mark all clicked");
                  }}
                >
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
            ) : (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <NotificationCard
                    id={notification.id}
                    text={notification?.data?.body}
                    name={notification?.data?.title}
                    date={dateFormat(notification?.created_at)}
                    time={humanReadable(notification?.created_at)}
                    read={notification?.read_at}
                    notiRead={notification?.read_at}
                    onClick={handleNotificationAction}
                  />
                </React.Fragment>
              ))
            )}
          </Col>
        </Row>
        <div className="text-center">
          <CustomButton text="Load More" className="siteBtn primaryBtn" />
        </div>
      </div>
    </div>
  );
};

export default withPagination(ConsolidatedNotifications);
