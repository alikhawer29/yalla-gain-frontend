/** Query params for subscription log lists. Omits unused/empty filter keys. */
export function toSubscriptionLogParams(filters = {}) {
  const params = {
    page: filters.page || 1,
    per_page: filters.per_page || 10,
  };

  const search = filters.search?.trim();
  if (search) params.search = search;
  if (filters.from_payment_date) params.from_payment_date = filters.from_payment_date;
  if (filters.to_payment_date) params.to_payment_date = filters.to_payment_date;
  if (filters.status === "1" || filters.status === "2") params.status = filters.status;

  return params;
}

/** Plan name for subscription log tables; appends trial label when applicable. */
export function formatSubscriptionPlanDisplayName(log) {
  const title = log?.subscription_plan?.title?.trim() || "-";
  const isTrial = log?.is_trial === true || log?.is_trial === 1;
  if (!isTrial) return title;

  const trialDays =
    log?.subscription_plan?.trial_days ??
    log?.trial_days ??
    7;
  const days = Number(trialDays) || 7;
  const dayWord = days === 1 ? "Day" : "Days";

  return `${title} (${days} ${dayWord} Trial)`;
}
