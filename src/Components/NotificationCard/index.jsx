import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

const NotificationCard = (props) => {
  const handleToggleRead = (e) => {
    e.stopPropagation();
    props.onToggleRead?.(props.id);
  };

  const handleCardClick = () => {
    props.onNavigate?.(props.id);
  };

  const isUnread = props.read === null;
  const isClickable = !!props.clickable;

  return (
    <div
      className={`notificationWrapper ${isUnread ? "unread" : ""}`}
      style={isClickable ? { cursor: "pointer" } : undefined}
      onClick={handleCardClick}
    >
      <div className="d-sm-flex justify-content-between align-items-center gap-3" key={props.id}>
        <div className="d-flex gap-3 align-items-center">
          <div className="d-flex flex-column gap-1 flex-grow-1">
            <div className="d-flex flex-column gap-1">
              {props?.name && (
                <h5 className="notificationHeading mb-1">{props.name}</h5>
              )}
              <p className="notificationText ps-0 mb-0">{props?.text}</p>
            </div>
            <div className="dateTime">
              <p className="p-sm l-grey-text mb-0">
                <FontAwesomeIcon icon={faClock} />
                <span className="dateTimeSeparator">|</span>
                {props?.time}
              </p>
              <p className="p-sm l-grey-text mb-0">
                <FontAwesomeIcon icon={faCalendar} />
                {props?.date}
              </p>
            </div>
          </div>
        </div>
        {isUnread && (
          <div className="flex-shrink-0 text-end">
            <button
              onClick={handleToggleRead}
              className="mark_all_btn fw-medium"
              style={{ color: "#15355E" }}
            >
              Mark as Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
