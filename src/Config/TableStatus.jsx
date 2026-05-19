export const generalStatus = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "1",
    text: "Active",
  },
  {
    value: "0",
    text: "Inactive",
  },
];
export const statusOptions = [
  {
    value: "1",
    text: "Active",
  },
  {
    value: "0",
    text: "Inactive",
  },
];
export const quizOptions = [
  {
    value: "",
    text: "Select Answer",
  },
  {
    value: "1",
    text: "Option A",
  },
  {
    value: "2",
    text: "Option B",
  },
  {
    value: "3",
    text: "Option C",
  },
  {
    value: "4",
    text: "Option D",
  },
];
export const editStatus = [
  {
    value: "Active",
    text: "Active",
  },
  {
    value: "Inactive",
    text: "Inactive",
  },
];
export const category = [
  {
    value: "",
    text: "Select Category",
  },
  {
    value: "medicalterminology",
    text: "Medical Terminology",
  },
  {
    value: "emergencyphrases ",
    text: "Emergency Phrases",
  },
];

export const categoryOptions = [
  {
    value: "",
    text: "Select Category",
  },
  {
    value: "1",
    text: "Category 1",
  },
  {
    value: "2",
    text: "Category 2",
  },
  {
    value: "3",
    text: "Category 3",
  },
];
export const serviceOptions = [
  {
    value: "",
    text: "Select Service",
  },
  {
    value: "1",
    text: "Service 1",
  },
  {
    value: "2",
    text: "Service 2",
  },
  {
    value: "3",
    text: "Service 3",
  },
];

export const serviceCategoryTypeOptions = [
  {
    value: "",
    text: "Select Type",
  },
  {
    value: "doctor",
    text: "Doctor",
  },
  {
    value: "trainer",
    text: "Trainer",
  },
];
export const language = [
  {
    value: "",
    text: "Select language",
  },
  {
    value: "english",
    text: "English",
  },
  {
    value: "arabic",
    text: "Arabic",
  },
];

export const timeDuration = [
  {
    value: "",
    text: "Select Your Duration",
  },
  {
    value: "30_minutes",
    text: "30 minutes",
  },
  {
    value: "1_hour",
    text: "1 Hour",
  },
];

// Challenge kinds
export const challengeKinds = [
  { value: "", text: "Select" },
  { value: "run", text: "Run" },
  { value: "workout", text: "Workout" },
  { value: "cycle", text: "Cycle" },
  { value: "strength", text: "Strength" },
  { value: "face_yoga", text: "Face Yoga" },
  { value: "cardio", text: "Cardio" },
];
export const partsOfSpeech = [
  {
    value: "",
    text: "Select Part of Speech",
  },
  {
    value: "noun",
    text: "Noun",
  },
  {
    value: "verb",
    text: "Verb",
  },
  {
    value: "adjective",
    text: "Adjective",
  },
  {
    value: "adverb",
    text: "Adverb",
  },
  {
    value: "pronoun",
    text: "Pronoun",
  },
  {
    value: "preposition",
    text: "Preposition",
  },
  {
    value: "conjunction",
    text: "Conjunction",
  },
  {
    value: "interjection",
    text: "Interjection",
  },
];
export const grammaticalGender = [
  {
    value: "",
    text: "Select Grammatical Gender",
  },
  {
    value: "masculine",
    text: "Masculine",
  },
  {
    value: "feminine",
    text: "Feminine",
  },
  {
    value: "neuter",
    text: "Neuter",
  },
  {
    value: "common",
    text: "Common",
  },
];
// Exercise keys for workout content
export const exerciseKeys = [
  { value: "", text: "Select Muscle" },
  { value: "chest", text: "Chest" },
  { value: "back", text: "Back" },
  { value: "shoulders", text: "Shoulders" },
  { value: "legs", text: "Legs" },
  { value: "biceps", text: "Biceps" },
  { value: "triceps", text: "Triceps" },
  { value: "trapeze", text: "Trapeze" },
  { value: "abs", text: "Abs" },
];

export const exercisesByMuscle = {
  chest: [
    { value: "cable_high_to_low", text: "Cable High to Low" },
    { value: "chest_butterfly", text: "Chest Butterfly" },
    { value: "declined_press", text: "Declined Chest Press" },
    { value: "flat_press", text: "Flat Press" },
    { value: "inclined_press", text: "Inclined Press" },
    { value: "pushups", text: "Pushups" },
  ],
  back: [
    { value: "barbell_rows", text: "Barbell Rows" },
    { value: "deadlift", text: "Deadlift" },
    { value: "lat_pulldown", text: "Lat Pulldown" },
    { value: "pull_over", text: "Pull Over" },
    { value: "seated_cable_rows", text: "Seated Cable Rows" },
    { value: "tbar_rows", text: "T-Bar Rows" },
    { value: "pullups", text: "Pull-Ups" },
  ],
  shoulders: [
    { value: "dumbbell_press", text: "Dumbbell Shoulder Press" },
    { value: "face_pulls", text: "Face Pulls" },
    { value: "front_raises", text: "Shoulder Front Raises" },
    { value: "lateral_raises", text: "Shoulder Lateral Raises" },
  ],
  legs: [
    { value: "hip_thrust", text: "Hip Thrust" },
    { value: "leg_curls", text: "Leg Curls" },
    { value: "leg_extension", text: "Leg Extension" },
    { value: "leg_press", text: "Leg Press" },
    { value: "romanian_deadlift", text: "Romanian Deadlift" },
    { value: "squats", text: "Squats" },
    { value: "calf_raises", text: "Calf Raises" },
  ],
  biceps: [
    { value: "biceps_curls", text: "Biceps Curls" },
    { value: "hammer_curls", text: "Hammer Curls" },
    { value: "incline_curls", text: "Inclined Biceps Curls" },
  ],
  triceps: [
    { value: "rope_pushdown", text: "Triceps Rope Pushdown" },
    { value: "dips", text: "Triceps Dips" },
  ],
  trapeze: [{ value: "shrugs", text: "Shrugs" }],
  abs: [
    { value: "leg_raises", text: "Leg Raises" },
    { value: "plank", text: "Plank" },
  ],
};

export const challengeTypes = [
  {
    value: "0",
    text: "Daily",
  },
  {
    value: "1",
    text: "Weekly",
  },
  {
    value: "2",
    text: "Monthly",
  },
];
export const normalStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "1",
    text: "Active",
  },
  {
    value: "0",
    text: "Inactive",
  },
];
export const genderOptions = [
  {
    value: "male",
    text: "Male",
  },
  {
    value: "female",
    text: "Female",
  },
];
export const enableDisableOptions = [
  {
    value: "1",
    text: "Enable",
  },
  {
    value: "0",
    text: "Disable",
  },
];
export const enableDisableStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "1",
    text: "Enable",
  },
  {
    value: "0",
    text: "Disable",
  },
];
export const queriesType = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "user",
    text: "User",
  },
  {
    value: "guest",
    text: "Guest",
  },
  {
    value: "serviceprovider ",
    text: "Service Provider ",
  },
];
export const appointmentTypeOptions = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "quick",
    text: "Quick",
  },
  {
    value: "standard",
    text: "Standard",
  },
];
export const pendingTypeOptions = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "pending",
    text: "Pending",
  },
  {
    value: "resolved",
    text: "Resolved",
  },
];
export const subscriptionType = [
  {
    value: "",
    text: "All",
  },
  {
    value: "0",
    text: "Monthly",
  },
  {
    value: "1",
    text: "Yearly",
  },
];
export const monthly = [
  {
    value: "2024",
    text: "2024",
  },
  {
    value: "2025",
    text: "2025",
  },
  {
    value: "2026",
    text: "2026",
  },
  {
    value: "2027",
    text: "2027",
  },
];
export const months = [
  {
    value: "01",
    text: "Jan",
  },
  {
    value: "02",
    text: "Feb",
  },
  {
    value: "03",
    text: "Mar",
  },
  {
    value: "04",
    text: "Apr",
  },
  {
    value: "05",
    text: "May",
  },
  {
    value: "06",
    text: "Jun",
  },
  {
    value: "07",
    text: "Jul",
  },
  {
    value: "08",
    text: "Aug",
  },
  {
    value: "09",
    text: "Sep",
  },
  {
    value: "10",
    text: "Oct",
  },
  {
    value: "11",
    text: "Nov",
  },
  {
    value: "12",
    text: "Dec",
  },
];
// export const chartStatus = [
//   {
//     value: "weekly",
//     text: "Past 7 Days",
//   },
//   {
//     value: "monthly",
//     text: "Monthly",
//   },
//   {
//     value: "yearly",
//     text: "Annually",
//   },
// ];
export const chartStatus = [
  {
    value: "monthly",
    text: "Monthly",
  },
  {
    value: "06 months",
    text: "06 months",
  },
  {
    value: "yearly",
    text: "Yearly",
  },
];
export const orderLogStatus = [
  {
    value: "Select",
    text: "Select",
  },
  {
    value: "preparing",
    text: "Preparing",
  },
  {
    value: "preparing_late",
    text: "Preparing - Late",
  },
  {
    value: "ready",
    text: "Ready",
  },
  {
    value: "ready_late",
    text: "Ready - Late",
  },
  {
    value: "picked",
    text: "Picked",
  },
  {
    value: "picked_late",
    text: "Picked - Late",
  },
];
export const status = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "active",
    text: "Active",
  },
  {
    value: "inactive",
    text: "Inactive",
  },
];
export const availbility = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "breakfast",
    text: "Breakfast",
  },
  {
    value: "lunch",
    text: "Lunch",
  },
  {
    value: "dinner",
    text: "Dinner",
  },
];
export const AppointmentType = [
  {
    value: "",
    text: "All",
  },
  {
    value: "standard",
    text: "	Standard",
  },
  {
    value: "quick",
    text: "Quick",
  },
];
export const subcriptionType = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "monthly",
    text: "Monthly",
  },
  {
    value: "yearly",
    text: "Yearly",
  },
];
export const subcriptionTypeTwo = [
  {
    value: "",
    text: "All",
  },
  {
    value: "monthly",
    text: "monthly",
  },
  {
    value: "yearly",
    text: "yearly",
  },
];
export const subscriptionDuration = [
  {
    value: "1",
    text: "1 Month",
  },
  {
    value: "2",
    text: "2 Months",
  },
  {
    value: "3",
    text: "3 Months",
  },
  {
    value: "4",
    text: "4 Months",
  },
  {
    value: "5",
    text: "5 Months",
  },
  {
    value: "6",
    text: "6 Months",
  },
  {
    value: "7",
    text: "7 Months",
  },
  {
    value: "8",
    text: "8 Months",
  },
  {
    value: "9",
    text: "9 Months",
  },
  {
    value: "10",
    text: "10 Months",
  },
  {
    value: "11",
    text: "11 Months",
  },
  {
    value: "12",
    text: "1 Year",
  },
];
export const feedbackStatus = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "user",
    text: "User",
  },
  {
    value: "restaurant",
    text: "Restaurant",
  },
  {
    value: "branch",
    text: "Branch",
  },
];
export const feedbackTypes = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "1",
    text: "Resolved",
  },
  {
    value: "0",
    text: "Pending",
  },
];
export const reportsStatus = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "1",
    text: "Resolved",
  },
  {
    value: "0",
    text: "Pending",
  },
];
export const categoryStatus = [
  {
    value: "",
    text: "Select",
  },
  {
    value: "0",
    text: "Diabetes Care",
  },
  {
    value: "1",
    text: "Pain Relief",
  },
  {
    value: "2",
    text: "Multivitamins",
  },
  {
    value: "3",
    text: "Burn Creams",
  },
  {
    value: "4",
    text: "Joint & Bone Health",
  },
];
export const sorting = [
  {
    value: "10",
    text: "10",
  },
  {
    value: "20",
    text: "20",
  },
  {
    value: "50",
    text: "50",
  },
  {
    value: "100",
    text: "100",
  },
];
export const notificationOptions = [
  {
    value: "",
    text: "All",
  },
  {
    value: "unread",
    text: "Unread",
  },
  {
    value: "read",
    text: "Read",
  },
];
export const appointmentStatus = [
  {
    value: "",
    text: "All",
  },
  {
    value: "upcoming",
    text: "Upcoming",
  },
  {
    value: "completde",
    text: "Completde",
  },
];
export const orderStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "pending",
    text: "Pending",
  },
  // {
  //   value: "confirmed",
  //   text: "Confirmed",
  // },
  // {
  //   value: "processing",
  //   text: "Processing",
  // },
  // {
  //   value: "onHold",
  //   text: "On Hold",
  // },
  // {
  //   value: "shipped",
  //   text: "Shipped",
  // },
  // {
  //   value: "outForDelivery",
  //   text: "Out For Delivery",
  // },
  {
    value: "delivered",
    text: "Delivered",
  },
  {
    value: "canceled",
    text: "Canceled",
  },
  // {
  //   value: "returned",
  //   text: "Returned",
  // },
  // {
  //   value: "refunded",
  //   text: "Refunded",
  // },
  // {
  //   value: "failed",
  //   text: "Failed",
  // },
  // {
  //   value: "completed",
  //   text: "Completed",
  // },
];
export const languageOptions = [
  {
    value: "0",
    text: "English",
  },
  {
    value: "1",
    text: "Spanish",
  },
];
export const quizLanguageOptions = [
  {
    value: "0",
    text: "English to Spanish",
  },
  {
    value: "1",
    text: "Spanish to English",
  },
];
export const consultantRequestsStatus = [
  {
    value: "",
    text: "All",
  },
  {
    value: "pending",
    text: "Pending",
  },
  {
    value: "rejected",
    text: "Rejected",
  },
];
export const accountTypeOptions = [
  { value: "", text: "Select Account Type" },
  { value: "checking", text: "Checking" },
  { value: "savings", text: "Savings" },
  { value: "business", text: "Business" },
];

export const workingHoursOptions = [
  { value: "", text: "Select Working Hours" },
  { value: "10", text: "10 Hrs" },
  { value: "20", text: "20 Hrs" },
  { value: "30", text: "30 Hrs" },
];
export const bankNameOptions = [
  { value: "", text: "Select Bank Name" },
  { value: "abc", text: "Abc" },
  { value: "xyz", text: "Xyz" },
];
export const activeExpiredStatus = [
  { value: "", text: "All" },
  { value: "1", text: "Active" },
  { value: "2", text: "Expired" },
];

// Year Options
export const yearOptions = [
  {
    value: "2024",
    text: "2024",
  },
  {
    value: "2025",
    text: "2025",
  },
  {
    value: "2026",
    text: "2026",
  },
  {
    value: "2027",
    text: "2027",
  },
  {
    value: "2028",
    text: "2028",
  },
  {
    value: "2029",
    text: "2029",
  },
  // You can add more years as needed
];

export const bookingTypeStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "1",
    text: "Upcoming",
  },
  {
    value: "2",
    text: "Pending",
  },
  {
    value: "3",
    text: "Past",
  },
  {
    value: "4",
    text: "Approved",
  },
];

export const ongoingStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "1",
    text: "On Going",
  },
  {
    value: "2",
    text: "Failed",
  },
  {
    value: "3",
    text: "Completed",
  },
];

export const countryOptions = [
  { value: "pakistan", text: "Pakistan" },
  { value: "united_states", text: "United States" },
  { value: "canada", text: "Canada" },
  { value: "india", text: "India" },
  { value: "united_kingdom", text: "United Kingdom" },
  { value: "australia", text: "Australia" },
  { value: "germany", text: "Germany" },
  { value: "france", text: "France" },
  { value: "japan", text: "Japan" },
  { value: "china", text: "China" },
];
export const stateOptions = [
  { value: "california", text: "California" },
  { value: "texas", text: "Texas" },
  { value: "florida", text: "Florida" },
  { value: "new_york", text: "New York" },
  { value: "illinois", text: "Illinois" },
  { value: "pennsylvania", text: "Pennsylvania" },
  { value: "ohio", text: "Ohio" },
];

export const appointmentsStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "upcoming",
    text: "Upcoming",
  },
  {
    value: "in-progress",
    text: "In-Progress",
  },
  {
    value: "past",
    text: "Past",
  },
  {
    value: "cancelled",
    text: "Cancelled",
  },
];

export const sessionTypeStatus = [
  {
    value: "all",
    text: "All",
  },
  {
    value: "chat",
    text: "Chat",
  },
  {
    value: "call",
    text: "Call",
  },
  {
    value: "video call",
    text: "Video Call",
  },
];

export const userTypeStatus = [
  {
    value: "user",
    text: "User",
  },
  {
    value: "guest",
    text: "Guest",
  },
  {
    value: "consultant",
    text: "Consultant",
  },
];
