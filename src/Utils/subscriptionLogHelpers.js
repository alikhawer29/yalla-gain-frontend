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
