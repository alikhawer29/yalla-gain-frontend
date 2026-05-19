export const PLAN_TYPE_OPTIONS = [
  { value: "free", text: "Free" },
  { value: "gold", text: "Gold" },
  { value: "platinum", text: "Platinum" },
];

export const DURATION_OPTIONS = [
  { value: "monthly", text: "Monthly" },
  { value: "yearly", text: "Yearly" },
];

/** Toggleable features — maps to API boolean fields */
export const FEATURE_TOGGLES = [
  {
    id: "ai_fitness",
    label: "AI-Powered Fitness Tracking",
    field: null,
    alwaysIncluded: true,
  },
  {
    id: "nutrition",
    label: "Nutrition Chatbot",
    field: "has_nutrition_chatbot",
  },
  {
    id: "spotify",
    label: "Spotify Integration",
    field: "has_spotify",
  },
  {
    id: "messaging",
    label: "Messaging & Community Posting",
    field: "has_messaging",
  },
];

export const NUMERIC_BENEFIT_FIELDS = [
  { name: "trainer_sessions", label: "Trainer Sessions" },
  { name: "doctor_sessions", label: "Doctor Sessions" },
  { name: "yalla_points", label: "Yalla Points Bonus" },
];

const PRESETS = {
  free: {
    trainer_sessions: 0,
    doctor_sessions: 0,
    yalla_points: 0,
    has_nutrition_chatbot: false,
    has_spotify: false,
    has_messaging: false,
  },
  gold_monthly: {
    trainer_sessions: 3,
    doctor_sessions: 3,
    yalla_points: 50,
    has_nutrition_chatbot: true,
    has_spotify: false,
    has_messaging: false,
  },
  gold_yearly: {
    trainer_sessions: 3,
    doctor_sessions: 3,
    yalla_points: 500,
    has_nutrition_chatbot: true,
    has_spotify: false,
    has_messaging: false,
  },
  platinum_monthly: {
    trainer_sessions: 5,
    doctor_sessions: 5,
    yalla_points: 100,
    has_nutrition_chatbot: true,
    has_spotify: true,
    has_messaging: true,
  },
  platinum_yearly: {
    trainer_sessions: 5,
    doctor_sessions: 5,
    yalla_points: 750,
    has_nutrition_chatbot: true,
    has_spotify: true,
    has_messaging: true,
  },
};

export const getPresetKey = (planType, duration) => {
  if (planType === "free") return "free";
  return `${planType}_${duration || "monthly"}`;
};

export const getPlanPreset = (planType, duration) =>
  PRESETS[getPresetKey(planType, duration)] || PRESETS.free;

export const getPlanDisplayTitle = (planType, duration) => {
  if (planType === "free") return "Free Plan";
  const type = planType.charAt(0).toUpperCase() + planType.slice(1);
  const period =
    duration === "yearly" ? "Plan" : duration === "monthly" ? "Plan" : "";
  return period ? `${type} ${period}` : type;
};
