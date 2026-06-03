/** Booking / appointment status colors (aligned with mobile app). */
export const BOOKING_STATUS_COLORS = {
  pending: "#FDB332",
  upcoming: "#FF7B7B",
  past: "#999999",
  approved: "#4CD964",
  "in-progress": "#4A9EFF",
  rejected: "#FF4F25",
  rescheduled: "#B388FF",
  cancelled: "#8B8B8B",
};

const STATUS_LABELS = {
  pending: "Pending",
  upcoming: "Upcoming",
  past: "Past",
  approved: "Approved",
  "in-progress": "In-Progress",
  rejected: "Rejected",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

/** Normalize API / form status to a single key. */
export const normalizeBookingStatusKey = (status) => {
  if (status == null || status === "") return "";
  let s = String(status).toLowerCase().trim().replace(/_/g, "-");
  s = s.replace(/\s+/g, "-");
  if (s === "inprogress") return "in-progress";
  if (s === "complete" || s === "completed") return "past";
  return s;
};

export const formatBookingStatusLabel = (status) => {
  if (status == null || status === "") return "-";
  const key = normalizeBookingStatusKey(status);
  if (STATUS_LABELS[key]) return STATUS_LABELS[key];
  const raw = String(status).replace(/_/g, " ").replace(/-/g, " ");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const getBookingStatusColor = (status) => {
  const key = normalizeBookingStatusKey(status);
  return BOOKING_STATUS_COLORS[key] ?? "#FFFFFF";
};

/** Matches existing `.statusChip.statusPending` pattern in doctor/trainer CSS. */
export const getBookingStatusChipClass = (status) => {
  const key = normalizeBookingStatusKey(status);
  const map = {
    pending: "statusPending",
    upcoming: "statusUpcoming",
    past: "statusPast",
    approved: "statusApproved",
    "in-progress": "statusInProgress",
    rejected: "statusRejected",
    rescheduled: "statusRescheduled",
    cancelled: "statusCancelled",
  };
  return map[key] || "statusDefault";
};
