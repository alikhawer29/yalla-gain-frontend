/** Shared options and type → allowed body parts for Add / Edit challenge screens. */

/** Select options for challenge “Time” (hour / minute). First option is placeholder. */
export const timeHourSelectOptions = [
  { value: "", text: "Hour" },
  ...Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    text: String(i).padStart(2, "0"),
  })),
];

export const timeMinuteSelectOptions = [
  { value: "", text: "Minute" },
  ...Array.from({ length: 60 }, (_, i) => ({
    value: String(i),
    text: String(i).padStart(2, "0"),
  })),
];

/**
 * Maps API challenge fields to form time_hour / time_minute (string for Select).
 */
export function parseChallengeTimeFromApi(data = {}) {
  const h = data.time_hour;
  const m = data.time_minute;
  if (h != null && h !== "" && m != null && m !== "") {
    const hi = Math.min(23, Math.max(0, Number(h)));
    const mi = Math.min(59, Math.max(0, Number(m)));
    return { time_hour: String(hi), time_minute: String(mi) };
  }
  const et = data.execution_time;
  if (typeof et === "string") {
    const trimmed = et.trim();
    const m24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
    if (m24) {
      return {
        time_hour: String(Math.min(23, Math.max(0, parseInt(m24[1], 10) || 0))),
        time_minute: String(Math.min(59, Math.max(0, parseInt(m24[2], 10) || 0))),
      };
    }
  }
  return { time_hour: "", time_minute: "" };
}

/**
 * Parses hour (0–23) and minute (0–59) from API: execution_time "HH:MM" or time_hour / time_minute.
 */
function parseChallengeHoursMinutes(data) {
  if (!data) return null;
  const et = data.execution_time;
  if (et != null && String(et).trim() !== "") {
    const trimmed = String(et).trim();
    const m = trimmed.match(/^(\d{1,2}):(\d{2})/);
    if (m) {
      return {
        h: Math.min(23, Math.max(0, parseInt(m[1], 10) || 0)),
        mi: Math.min(59, Math.max(0, parseInt(m[2], 10) || 0)),
      };
    }
  }
  const h = data.time_hour;
  const mi = data.time_minute;
  if (h != null && h !== "" && mi != null && mi !== "") {
    return {
      h: Math.min(23, Math.max(0, Number(h))),
      mi: Math.min(59, Math.max(0, Number(mi))),
    };
  }
  return null;
}

/**
 * Human-readable time for View: e.g. "1 hour", "1 hour 30 minutes", "30 minutes".
 */
export function formatChallengeTimeForView(data) {
  const parsed = parseChallengeHoursMinutes(data);
  if (!parsed) return "-";
  const { h, mi } = parsed;
  if (h === 0 && mi === 0) return "-";

  const parts = [];
  if (h > 0) {
    parts.push(h === 1 ? "1 hour" : `${h} hours`);
  }
  if (mi > 0) {
    parts.push(mi === 1 ? "1 minute" : `${mi} minutes`);
  }
  return parts.join(" ");
}

export const bodyPartOptions = [
  { value: "arms", text: "Arms" },
  { value: "biceps", text: "Biceps" },
  { value: "triceps", text: "Triceps" },
  { value: "shoulders", text: "Shoulders" },
  { value: "chest", text: "Chest" },
  { value: "waist", text: "Waist" },
  { value: "back", text: "Back" },
  { value: "neck", text: "Neck" },
  { value: "face", text: "Face" },
  { value: "core", text: "Core" },
  { value: "glutes", text: "Glutes" },
  { value: "quads", text: "Quads" },
  { value: "hamstrings", text: "Hamstrings" },
  { value: "calves", text: "Calves" },
];

export const challengeTypeBodyParts = {
  run: ["quads", "hamstrings", "calves", "glutes", "core", "waist"],

  cycle: [
    "quads",
    "hamstrings",
    "calves",
    "glutes",
    "core",
    "waist",
    "back",
    "neck",
  ],

  workout: [
    "arms",
    "biceps",
    "triceps",
    "shoulders",
    "chest",
    "back",
    "core",
    "waist",
    "glutes",
    "quads",
    "hamstrings",
    "calves",
    "neck",
  ],

  strength: ["arms", "biceps", "triceps", "shoulders", "chest", "back", "core"],

  face_yoga: ["face"],

  cardio: ["quads", "hamstrings", "calves", "glutes", "core"],
};

/**
 * Maps GET /challenge/:id `body_parts` into MultiSelect value shape.
 * Supports API format: [{ text, value, percentage }, ...] and legacy { body_part_id, name, ... }.
 */
export function mapApiBodyPartsToForm(bodyParts, options = bodyPartOptions) {
  const list = Array.isArray(bodyParts) ? bodyParts : [];
  return list.map((bp) => {
    const rawVal =
      bp.value != null
        ? String(bp.value)
        : bp.body_part_id != null
          ? String(bp.body_part_id)
          : bp.id != null
            ? String(bp.id)
            : "";
    const option = options.find((opt) => opt.value === rawVal);
    const text =
      bp.text ?? bp.name ?? option?.text ?? rawVal;
    return {
      value: option?.value ?? rawVal,
      text: option?.text ?? text,
      percentage:
        bp.percentage != null && bp.percentage !== ""
          ? String(bp.percentage)
          : "",
    };
  });
}
