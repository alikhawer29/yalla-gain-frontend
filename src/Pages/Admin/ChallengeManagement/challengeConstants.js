/** Shared options and type → allowed body parts for Add / Edit challenge screens. */

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
