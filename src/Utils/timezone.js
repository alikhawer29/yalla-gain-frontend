import moment from "moment-timezone";

/** Browser IANA timezone, e.g. "Asia/Karachi" */
export const getBrowserTimezone = () => {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      moment.tz.guess() ||
      "UTC"
    );
  } catch {
    return moment.tz.guess() || "UTC";
  }
};

/** Options for Select: { value, text } */
export const timezoneSelectOptions = (() => {
  const names = moment.tz.names();
  return [
    { value: "", text: "Select Timezone" },
    ...names.map((tz) => ({
      value: tz,
      text: `${tz} (UTC${moment.tz(tz).format("Z")})`,
    })),
  ];
})();

const toValidDate = (utc) => {
  if (!utc) return null;
  const d = new Date(utc);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** UTC ISO → browser local time, e.g. "8:00 PM" */
export const formatUtcToLocalTime = (utc) => {
  const d = toValidDate(utc);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

/** UTC ISO → browser local date string */
export const formatUtcToLocalDate = (utc) => {
  const d = toValidDate(utc);
  if (!d) return "";
  return d.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/** UTC start/end → "8:00 PM - 9:00 PM" */
export const formatUtcTimeRange = (startUtc, endUtc) => {
  const start = formatUtcToLocalTime(startUtc);
  const end = formatUtcToLocalTime(endUtc);
  if (start && end) return `${start} - ${end}`;
  return start || end || "-";
};

/**
 * Service slot display: use start_at_utc / end_at_utc only.
 * Do NOT treat raw start_time as browser-local (it is provider-local).
 */
export const formatServiceSlotLocalRange = (slot) => {
  if (!slot) return "-";
  return formatUtcTimeRange(slot.start_at_utc, slot.end_at_utc);
};

/** Booking date from scheduled_start_at (browser local), with legacy date fallback */
export const getBookingLocalDate = (item, fallbackDate) => {
  if (item?.scheduled_start_at) {
    return formatUtcToLocalDate(item.scheduled_start_at) || "-";
  }
  if (fallbackDate) return fallbackDate;
  return (
    item?.appointment_date ||
    item?.booking_date ||
    item?.date ||
    item?.created_at ||
    "-"
  );
};

/** Booking time from scheduled_start_at / scheduled_end_at only */
export const getBookingLocalTimeRange = (item) => {
  if (!item) return "-";
  if (item.scheduled_start_at || item.scheduled_end_at) {
    return formatUtcTimeRange(item.scheduled_start_at, item.scheduled_end_at);
  }
  return "-";
};
