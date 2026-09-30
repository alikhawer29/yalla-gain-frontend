/**
 * Format booking/appointment charges for admin tables & details.
 * Plan-included bookings: show session value + "Included in Plan"
 * (user paid 0 coins, but commission/payout still use session value).
 */
export function formatAppointmentChargesDisplay(item) {
  if (!item) return "-";

  const included =
    item.payment_type === "subscription_included" ||
    item.uses_subscription_session === true ||
    item.paymentType === "subscription_included";

  const sessionValue =
    item.session_value ??
    item.subscription_session_value ??
    item.service?.charges;

  const paidAmount =
    item.amount_paid ?? item.amount ?? item.charges ?? item.service?.charges;

  if (included) {
    const value =
      sessionValue != null && sessionValue !== ""
        ? sessionValue
        : paidAmount != null && paidAmount !== "" && Number(paidAmount) > 0
          ? paidAmount
          : null;

    if (value == null || value === "" || value === "-") {
      return "Included in Plan";
    }

    return `${value} Yalla Coins (Included in Plan)`;
  }

  if (paidAmount == null || paidAmount === "" || paidAmount === "-") {
    return "-";
  }

  return `${paidAmount} Yalla Coins`;
}
