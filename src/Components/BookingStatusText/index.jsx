import {
  formatBookingStatusLabel,
  getBookingStatusChipClass,
  getBookingStatusColor,
} from "../../Utils/bookingStatus";

/**
 * Renders a booking/appointment status with consistent colors.
 * @param {"chip"|"text"} variant — chip uses statusChip + CSS class; text uses inline color
 */
const BookingStatusText = ({ status, variant = "chip", className = "" }) => {
  const label = formatBookingStatusLabel(status);
  if (label === "-") return <span className={className}>-</span>;

  if (variant === "text") {
    return (
      <span
        className={`booking-status-text ${className}`.trim()}
        style={{ color: getBookingStatusColor(status) }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`statusChip ${getBookingStatusChipClass(status)} ${className}`.trim()}
    >
      {label}
    </span>
  );
};

export default BookingStatusText;
