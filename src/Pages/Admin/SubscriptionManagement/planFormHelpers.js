import {
  FEATURE_TOGGLES,
  getPlanDisplayTitle,
  getPlanPreset,
  getPresetKey,
} from "./planConfig";

export const isFreePlan = (planType) => planType === "free";

const toPayloadFlag = (value) => (value ? 1 : 0);

export const toFormFlag = (value) =>
  value === 1 || value === "1" || value === true;

export const normalizePlanDuration = (duration) => {
  const d = String(duration || "monthly").toLowerCase();
  if (d === "yearly" || d === "annual" || d === "year") return "yearly";
  return "monthly";
};

const isYearlyDuration = (duration) =>
  normalizePlanDuration(duration) === "yearly";

/** Sessions label in preview & features — always per month */
const SESSION_PERIOD_LABEL = "month";

const pointsSuffix = (duration) =>
  isYearlyDuration(duration) ? "Points/year" : "Points/month";

export const getAppAccessLabel = (planType) => {
  if (planType === "free") return "Limited Access";
  if (planType === "platinum") return "Full Access + Premium Features";
  return "Full Access";
};

/** Live preview lines for Section 4 */
export const buildPlanPreview = (values) => {
  const free = isFreePlan(values.plan_type);
  const duration = normalizePlanDuration(values.duration);
  const trainer = Number(values.trainer_sessions) || 0;
  const doctor = Number(values.doctor_sessions) || 0;
  const points = Number(values.yalla_points) || 0;

  const items = [
    { type: "included", text: getAppAccessLabel(values.plan_type) },
    { type: "included", text: "AI Fitness Tracking" },
    {
      type: free ? "limited" : "included",
      text: free
        ? "Workout Plans & AI Trainer — Limited"
        : "Workout Plans & AI Trainer",
    },
    {
      type: values.has_nutrition_chatbot ? "included" : "excluded",
      text: "Nutrition Chatbot",
    },
  ];

  if (!free && trainer > 0) {
    items.push({
      type: "included",
      text: `Trainer Consultations — ${trainer}/${SESSION_PERIOD_LABEL}`,
    });
  } else if (free) {
    items.push({ type: "excluded", text: "Trainer Consultations" });
  }

  if (!free && doctor > 0) {
    items.push({
      type: "included",
      text: `Doctor Consultations — ${doctor}/${SESSION_PERIOD_LABEL}`,
    });
  } else if (free) {
    items.push({ type: "excluded", text: "Doctor Consultations" });
  }

  items.push({
    type: values.has_spotify ? "included" : "excluded",
    text: "Spotify Integration",
  });
  items.push({
    type: values.has_messaging ? "included" : "excluded",
    text: "Messaging & Community Posting",
  });

  if (free || points <= 0) {
    items.push({ type: "excluded", text: "Yalla Points Bonus" });
  } else {
    items.push({
      type: "bonus",
      text: `${points} Yalla ${pointsSuffix(duration)}`,
    });
  }

  return {
    title: getPlanDisplayTitle(values.plan_type, duration),
    items,
  };
};

/** API features[] strings — auto-generated from config */
export const generateFeaturesList = (values) => {
  const free = isFreePlan(values.plan_type);
  const duration = normalizePlanDuration(values.duration);
  const trainer = Number(values.trainer_sessions) || 0;
  const doctor = Number(values.doctor_sessions) || 0;
  const points = Number(values.yalla_points) || 0;

  const lines = [
    `App Access: ${getAppAccessLabel(values.plan_type)}`,
    "AI-Powered Fitness Tracking: Included",
    `Workout Plans & AI Trainer: ${free ? "Limited" : "Included"}`,
    `Nutrition Chatbot: ${values.has_nutrition_chatbot ? "Included" : "Not included"}`,
  ];

  if (free || trainer <= 0) {
    lines.push("Trainer Consultations: Not included");
  } else {
    lines.push(
      `Trainer Consultations: ${trainer} sessions/${SESSION_PERIOD_LABEL}`,
    );
  }

  if (free || doctor <= 0) {
    lines.push("Doctor Consultations: Not included");
  } else {
    lines.push(
      `Doctor Consultations: ${doctor} sessions/${SESSION_PERIOD_LABEL}`,
    );
  }

  lines.push(
    `Spotify Integration: ${values.has_spotify ? "Included" : "Not included"}`,
  );
  lines.push(
    `Messaging & Community Posting: ${values.has_messaging ? "Included" : "Not included"}`,
  );

  if (free || points <= 0) {
    lines.push("Yalla Points Bonus: 0 Points");
  } else {
    lines.push(`Yalla Points Bonus: ${points} ${pointsSuffix(duration)}`);
  }

  return lines;
};

export const getInitialPlanValues = (planType = "free", duration = null) => {
  const preset = getPlanPreset(planType, duration);
  return {
    plan_type: planType,
    duration: planType === "free" ? null : duration || "monthly",
    price: planType === "free" ? 0 : "",
    has_trial: false,
    trainer_sessions: preset.trainer_sessions,
    doctor_sessions: preset.doctor_sessions,
    yalla_points: preset.yalla_points,
    has_spotify: preset.has_spotify,
    has_messaging: preset.has_messaging,
    has_nutrition_chatbot: preset.has_nutrition_chatbot,
  };
};

export const applyPlanPreset = (planType, duration, setFieldValue) => {
  const preset = getPlanPreset(planType, duration);
  setFieldValue("trainer_sessions", preset.trainer_sessions);
  setFieldValue("doctor_sessions", preset.doctor_sessions);
  setFieldValue("yalla_points", preset.yalla_points);
  setFieldValue("has_spotify", preset.has_spotify);
  setFieldValue("has_messaging", preset.has_messaging);
  setFieldValue("has_nutrition_chatbot", preset.has_nutrition_chatbot);
};

export const handlePlanTypeChange = (planType, setFieldValue, values = {}) => {
  if (planType === "free") {
    setFieldValue("duration", null);
    setFieldValue("price", 0);
    setFieldValue("has_trial", false);
    applyPlanPreset("free", null, setFieldValue);
    return;
  }

  const duration = values.duration || "monthly";
  setFieldValue("duration", duration);
  if (values.price === 0 || values.price === "0") {
    setFieldValue("price", "");
  }
  applyPlanPreset(planType, duration, setFieldValue);
};

export const handleDurationChange = (duration, planType, setFieldValue) => {
  if (!isFreePlan(planType)) {
    applyPlanPreset(planType, duration, setFieldValue);
  }
};

const mapDurationFieldsToPayload = (values, free) => {
  const yearly = isYearlyDuration(values.duration);
  const trainer = Number(values.trainer_sessions) || 0;
  const doctor = Number(values.doctor_sessions) || 0;
  const points = Number(values.yalla_points) || 0;

  return {
    yalla_points_monthly: free || yearly ? 0 : points,
    yalla_points_annual: free || !yearly ? 0 : points,
    trainer_sessions_monthly: free ? 0 : trainer,
    doctor_sessions_monthly: free ? 0 : doctor,
  };
};

export const buildPlanPayload = (values) => {
  const free = isFreePlan(values.plan_type);

  return {
    plan_type: values.plan_type,
    duration: free ? null : values.duration,
    price: free ? 0 : Number(values.price),
    has_trial: free ? 0 : toPayloadFlag(values.has_trial),
    ...mapDurationFieldsToPayload(values, free),
    has_spotify: toPayloadFlag(values.has_spotify),
    has_messaging: toPayloadFlag(values.has_messaging),
    has_nutrition_chatbot: toPayloadFlag(values.has_nutrition_chatbot),
    features: generateFeaturesList(values),
    status: 1,
  };
};

export const mapPlanToForm = (d) => {
  const planType = (d.plan_type || "gold").toLowerCase();
  const free = isFreePlan(planType);
  const duration = free ? null : normalizePlanDuration(d.duration || "monthly");
  const yearly = isYearlyDuration(duration);

  const preset = getPlanPreset(planType, duration);

  return {
    plan_type: planType,
    duration,
    price: free ? 0 : (d.price?.toString() ?? ""),
    has_trial: toFormFlag(d.has_trial),
    trainer_sessions:
      d.trainer_sessions_monthly ??
      d.trainer_sessions_annual ??
      preset.trainer_sessions,
    doctor_sessions:
      d.doctor_sessions_monthly ??
      d.doctor_sessions_annual ??
      preset.doctor_sessions,
    yalla_points: yearly
      ? (d.yalla_points_annual ?? preset.yalla_points)
      : (d.yalla_points_monthly ?? preset.yalla_points),
    has_spotify: toFormFlag(d.has_spotify),
    has_messaging: toFormFlag(d.has_messaging),
    has_nutrition_chatbot: toFormFlag(d.has_nutrition_chatbot),
  };
};
