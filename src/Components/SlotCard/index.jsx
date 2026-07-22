import React from "react";
import { Card } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa6";
import {
  formatUtcToLocalDate,
  formatUtcToLocalTime,
} from "../../Utils/timezone";
import "./style.css";

const SlotCard = ({ day, date, slots }) => {
  return (
    <Card className="card-slot">
      <Card.Header className="pt-3 pb-0">
        <Card.Title className="mb-0 text-capitalize fw-medium text-center">
          {day}
        </Card.Title>
        <h6 className="date"></h6>
      </Card.Header>

      <Card.Body className="pt-2">
        {slots.map((slot, index) => {
          const slotDate =
            formatUtcToLocalDate(slot.start_at_utc) ||
            formatUtcToLocalDate(date) ||
            "";
          const startLabel = formatUtcToLocalTime(slot.start_at_utc) || "-";
          const endLabel = formatUtcToLocalTime(slot.end_at_utc) || "-";

          return (
            <div className="slot-row" key={index}>
              <div className="date fw-medium text-center">{slotDate}</div>
              <div className="slot-time">
                <h4 className="fw-medium">Slot Time</h4>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center fw-medium">
                    <FaRegClock className="me-2" />
                    {startLabel}
                  </div>
                  <div className="d-flex align-items-center fw-medium">
                    <FaRegClock className="me-2" />
                    {endLabel}
                  </div>
                </div>
              </div>
              <div
                className={`slot-status fw-bold text-center text-decoration-underline ${
                  slot.isBooked ? "booked" : "free"
                }`}
              >
                {slot.isBooked ? "Booked" : "Free"}
              </div>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default SlotCard;
