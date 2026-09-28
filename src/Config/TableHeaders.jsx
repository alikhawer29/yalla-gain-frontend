export const userHeaders = [
  {
    key: "id",
    title: "S.No",
  },
  {
    key: "userName",
    title: "User Name",
  },
  {
    key: "emailAddress",
    title: "Email Address",
  },
  {
    key: "registeredOn",
    title: "Registration Date",
  },
  {
    key: "status",
    title: "Status",
  },
];

export const appointmentHeader = [
  {
    key: "id",
    title: "S.No",
  },
  {
    key: "bookingID",
    title: "Booking ID",
  },
  {
    key: "consultantName",
    title: "Consultant Name",
  },
  {
    key: "bookingDate",
    title: "Booking Date",
  },
  {
    key: "appointmentDate",
    title: "Appointment Date",
  },
  {
    key: "duration",
    title: "Duration",
  },
  {
    key: "sessiontype",
    title: "Session Type",
  },
  {
    key: "appointmenttype",
    title: "appointment type",
  },
  {
    key: "amount",
    title: "Amount",
  },
  {
    key: "status",
    title: "status",
  },
];

export const appointmentLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "bookingId", title: "Booking ID" },
  { key: "userName", title: "User Name" },
  { key: "serviceCategory", title: "Service Category" },
  { key: "providerName", title: "Service Provider Name" },
  { key: "bookingDate", title: "Booking Date" },
  { key: "charges", title: "Charges" },
];

export const bookingsLogsHeaders = [
  {
    key: "id",
    title: "S.No",
  },
  {
    key: "bookingId",
    title: "Booking ID",
  },
  {
    key: "bookingType",
    title: "Booking Type",
  },
  {
    key: "date",
    title: "Date",
  },
  {
    key: "charges",
    title: "Charges",
  },
  {
    key: "status",
    title: "Status",
  },
];
export const challengeLogsHeaders = [
  {
    key: "id",
    title: "S.No",
  },
  {
    key: "challenge_title",
    title: "Challenge Title",
  },
  {
    key: "challenge_type",
    title: "Challenge Type",
  },
  {
    key: "start_date",
    title: "Start Date",
  },
  {
    key: "status",
    title: "Status",
  },
];

export const serviceCategoryHeaders = [
  { key: "id", title: "S.No" },
  { key: "title", title: "Category Title" },
  { key: "type", title: "Type" },
  { key: "created_at", title: "Creation Date" },
  { key: "status", title: "Status" },
  { key: "action", title: "Action" },
];
export const subscriptionLogsHeaders = [
  {
    key: "id",
    title: "S.No",
  },
  {
    key: "subscription_title",
    title: "Subscription Title",
  },
  {
    key: "subscription_duration",
    title: "Subscription Duration",
  },
  {
    key: "coins_spent",
    title: "Coins Spent",
  },
  {
    key: "total_payment",
    title: "Total Payment",
  },
  {
    key: "payment_date",
    title: "Payment Date",
  },
  {
    key: "expiry_date",
    title: "Expiry Date",
  },
  {
    key: "status",
    title: "Status",
  },
];

// Admin-level subscription logs list (users' subscriptions)
export const subscriptionAdminLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "full_name", title: "Full Name" },
  { key: "email", title: "Email Address" },
  { key: "plan_name", title: "Plan Name" },
  { key: "status", title: "Status" },
  { key: "price", title: "Price" },
  { key: "purchase_date", title: "Purchase date" },
  { key: "expiry_date", title: "Expiry Date" },
];

// Subscription plans management table headers
export const subscriptionPlanHeaders = [
  { key: "id", title: "S.No" },
  { key: "title", title: "Subscription Title" },
  { key: "duration", title: "Duration" },
  { key: "price", title: "Price" },
  { key: "rate", title: "Coin Rate" },
  { key: "coins", title: "Converted Coins" },
  { key: "created_at", title: "Creation Date" },
  { key: "updated_at", title: "Last modified" },
  { key: "status", title: "Status" },
];

// Commission logs table headers
export const commissionLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "commission_percentage", title: "Commission Percentage" },
  { key: "updated_on", title: "Update On" },
];

// Consultation fee logs table headers
export const consultationFeeLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "consultation_fee", title: "Consultation Fee" },
  { key: "updated_on", title: "Update On" },
];

// Payout logs table headers
export const payoutLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "disbursement_time", title: "Disbursement Time" },
  { key: "updated_on", title: "Update On" },
];

// Payment Logs (Doctor/Trainer bookings)
export const paymentLogsBookingHeaders = [
  { key: "id", title: "S.No" },
  { key: "booking_id", title: "Booking ID" },
  { key: "booking_charges", title: "Booking Charges" },
  { key: "commission", title: "Commission" },
  { key: "commission_aed", title: "Commission AED" },
  { key: "commission_percentage", title: "Commission %" },
  { key: "booking_date", title: "Booking Date" },
  { key: "is_paid", title: "Is Paid" },
];

// Payment Logs – coins commission tab
export const coinsCommissionLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "type", title: "Type" },
  { key: "date", title: "Date" },
  { key: "user", title: "User" },
  // { key: "recipient", title: "Recipient" },
  { key: "amount", title: "Amount" },
  { key: "coins", title: "Coins" },
  { key: "commission", title: "Commission" },
  { key: "commission_percentage", title: "Commission %" },
];

// Query/Feedback logs table headers
export const queryLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "name", title: "Name" },
  { key: "email", title: "Email Address" },
  { key: "subject", title: "Subject" },
  { key: "message", title: "Message" },
  { key: "created_at", title: "Date" },
];

export const complaintLogsHeaders = [
  { key: "id", title: "S.No" },
  { key: "name", title: "Name" },
  { key: "email", title: "Email Address" },
  { key: "user_type", title: "User Type" },
  { key: "created_at", title: "Date" },
];

// Reports management
export const reportsBookingHeaders = [
  { key: "id", title: "S.No" },
  { key: "booking_id", title: "Booking ID" },
  { key: "name", title: "Reported By" },
  { key: "user_type", title: "Reported Against" },
  { key: "booking_date", title: "Booking Date" },
  { key: "reported_on", title: "Reported On" },
  { key: "charges", title: "Charges" },
  { key: "status", title: "Status" },
];

export const reportsNewsfeedHeaders = [
  { key: "id", title: "S.No" },
  { key: "name", title: "Name" },
  { key: "email", title: "Email Address" },
  { key: "reported_on", title: "Reported On" },
  { key: "status", title: "Status" },
];

// Workout Content management table headers
export const contentHeaders = [
  { key: "id", title: "S.No" },
  // { key: "title", title: "Title" },
  { key: "muscle_title", title: "Muscle" },
  // { key: "exercise_key", title: "Exercise Type" },
  // { key: "image", title: "Image" },
  { key: "created_at", title: "Created On" },
  { key: "status", title: "Status" },
];

// Workout Content videos table headers
export const contentVideoHeaders = [
  { key: "id", title: "S.No" },
  { key: "title", title: "Exercise" },
  { key: "sets", title: "Sets" },
  { key: "rest_time", title: "Rest Time" },
  { key: "created_at", title: "Created On" },
  { key: "status", title: "Status" },
];

// Yalla coin logs (in-app and management)
export const inAppCoinHeaders = [
  { key: "id", title: "S.No" },
  { key: "full_name", title: "Name" },
  { key: "email", title: "Email" },
  { key: "coins", title: "Coins" },
  { key: "price", title: "Price" },
  { key: "purchase_date", title: "Date" },
];

export const coinManagementHeaders = [
  { key: "id", title: "S.No" },
  { key: "amount", title: "Set Amount" },
  { key: "created_at", title: "Update On" },
];

// Challenge management headers (static for now)
export const challengeHeaders = [
  { key: "id", title: "S.No" },
  { key: "title", title: "Challenge Title" },
  { key: "type", title: "Challenge Type" },
  { key: "upload_date", title: "Upload Date" },
  { key: "duration", title: "Duration" },
  { key: "status", title: "Status" },
];

// Doctor management module headers
export const doctorManagementHeaders = [
  { key: "id", title: "S.No" },
  { key: "name", title: "Doctor Name" },
  { key: "email", title: "Email Address" },
  { key: "registrationDate", title: "Registration Date" },
  { key: "status", title: "Status" },
];

export const doctorBookingHeaders = [
  { key: "id", title: "S.No" },
  { key: "bookingId", title: "Booking ID" },
  { key: "serviceCategory", title: "Service Category" },
  { key: "date", title: "Date" },
  { key: "charges", title: "Charges" },
  { key: "status", title: "Status" },
];

export const doctorServicesHeaders = [
  { key: "id", title: "S.No" },
  { key: "serviceCategory", title: "Service Category" },
  { key: "createdOn", title: "Creation Date" },
  { key: "charges", title: "Service Charges" },
  { key: "status", title: "Status" },
];

export const doctorServiceBookingHeaders = [
  { key: "id", title: "S.No" },
  { key: "bookingId", title: "Booking ID" },
  { key: "userName", title: "User Name" },
  { key: "date", title: "Date" },
  { key: "charges", title: "Charges" },
  { key: "status", title: "Status" },
];

export const doctorRequestsHeaders = [
  { key: "id", title: "S.No" },
  { key: "doctorName", title: "Doctor Name" },
  { key: "status", title: "Status" },
  { key: "requestedDate", title: "Requested Date" },
];
