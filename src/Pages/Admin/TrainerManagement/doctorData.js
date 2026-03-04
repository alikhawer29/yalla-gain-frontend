import { images } from "../../../Assets";

export const doctorDirectory = [
  { id: "01", name: "Dr. John Carter", email: "john.carter@gmail.com", registrationDate: "12/03/2024", status: "Active" },
  { id: "02", name: "Dr. Alex Rivers", email: "alex.rivers@gmail.com", registrationDate: "12/03/2024", status: "Inactive" },
  { id: "03", name: "Dr. Chris Walker", email: "chris.walker@gmail.com", registrationDate: "12/03/2024", status: "Active" },
  { id: "04", name: "Dr. Andrew Miles", email: "andrew.miles@gmail.com", registrationDate: "12/03/2024", status: "Inactive" },
  { id: "05", name: "Dr. James Brown", email: "james.brown@gmail.com", registrationDate: "12/03/2024", status: "Active" },
  { id: "06", name: "Dr. Robert Finch", email: "robert.finch@gmail.com", registrationDate: "12/03/2024", status: "Active" },
  { id: "07", name: "Dr. Smith Harper", email: "smith.harper@gmail.com", registrationDate: "12/03/2024", status: "Inactive" },
];

const defaultDetails = {
  gender: "Male",
  phone: "+1 203 456 7890",
  state: "State ABC",
  city: "City ABC",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  experience: "Experience A, Experience B",
  specialization: "Specialization A",
  language: "English",
};

export const doctorDetailsMap = doctorDirectory.reduce((acc, doctor) => {
  acc[doctor.id] = {
    ...defaultDetails,
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    status: doctor.status,
    avatar: images.UserImage,
    certification: {
      institute: "Institute ABC",
      title: "Certificate ABC",
      image: images.certificate_image,
    },
  };
  return acc;
}, {});

doctorDetailsMap["02"].gender = "Female";
doctorDetailsMap["02"].language = "English, Arabic";
doctorDetailsMap["05"].phone = "+1 303 456 9870";

export const doctorBookingLogs = Object.keys(doctorDetailsMap).reduce((acc, doctorId) => {
  acc[doctorId] = [
    { id: "01", bookingId: "#12345", serviceCategory: "ABC Category", date: "12/03/2024", charges: "10 Yalla Coins", status: "Pending" },
    { id: "02", bookingId: "#12346", serviceCategory: "ABC Category", date: "12/03/2024", charges: "10 Yalla Coins", status: "Upcoming" },
    { id: "03", bookingId: "#12347", serviceCategory: "ABC Category", date: "12/03/2024", charges: "10 Yalla Coins", status: "Pending" },
    { id: "04", bookingId: "#12348", serviceCategory: "ABC Category", date: "12/03/2024", charges: "10 Yalla Coins", status: "Past" },
    { id: "05", bookingId: "#12349", serviceCategory: "ABC Category", date: "12/03/2024", charges: "10 Yalla Coins", status: "Past" },
    { id: "06", bookingId: "#12350", serviceCategory: "ABC Category", date: "12/03/2024", charges: "10 Yalla Coins", status: "Approved" },
  ];
  return acc;
}, {});

export const doctorServices = Object.keys(doctorDetailsMap).reduce((acc, doctorId) => {
  acc[doctorId] = [
    { id: "S01", serviceCategory: "Category ABC", createdOn: "12/03/2024", charges: "10 Yalla Coins", status: "Active" },
    { id: "S02", serviceCategory: "Category DEF", createdOn: "12/03/2024", charges: "15 Yalla Coins", status: "Inactive" },
    { id: "S03", serviceCategory: "Category GHI", createdOn: "12/03/2024", charges: "20 Yalla Coins", status: "Active" },
    { id: "S04", serviceCategory: "Category JKL", createdOn: "12/03/2024", charges: "18 Yalla Coins", status: "Inactive" },
  ];
  return acc;
}, {});

export const doctorServiceBookingLogs = Object.keys(doctorServices).reduce((acc, doctorId) => {
  doctorServices[doctorId].forEach((service) => {
    acc[service.id] = [
      { id: "01", bookingId: "#12345", userName: "Alex", date: "12/03/2024", charges: "10 Yalla Coins", status: "Pending" },
      { id: "02", bookingId: "#12346", userName: "Chris", date: "12/03/2024", charges: "10 Yalla Coins", status: "Upcoming" },
      { id: "03", bookingId: "#12347", userName: "Andrew", date: "12/03/2024", charges: "10 Yalla Coins", status: "Pending" },
      { id: "04", bookingId: "#12348", userName: "James", date: "12/03/2024", charges: "10 Yalla Coins", status: "Past" },
      { id: "05", bookingId: "#12349", userName: "Robert", date: "12/03/2024", charges: "10 Yalla Coins", status: "Past" },
      { id: "06", bookingId: "#12350", userName: "Smith", date: "12/03/2024", charges: "10 Yalla Coins", status: "Approved" },
    ];
  });
  return acc;
}, {});

export const doctorReviews = Object.keys(doctorDetailsMap).reduce((acc, doctorId) => {
  acc[doctorId] = {
    rating: 4.5,
    totalReviews: 200,
    breakdown: [
      { label: "5 Star", value: 120 },
      { label: "4 Star", value: 30 },
      { label: "3 Star", value: 40 },
      { label: "2 Star", value: 1 },
      { label: "1 Star", value: 1 },
    ],
    list: [
      {
        id: "R01",
        name: "Arlene Norris",
        date: "1 October 2023",
        rating: 5,
        comment:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        avatar: images.UserImage,
      },
      {
        id: "R02",
        name: "Kelvin",
        date: "1 October 2023",
        rating: 4,
        comment:
          "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        avatar: images.UserImage,
      },
      {
        id: "R03",
        name: "Mandy",
        date: "1 October 2023",
        rating: 4,
        comment:
          "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",
        avatar: images.UserImage,
      },
      {
        id: "R04",
        name: "Justin McCoy",
        date: "1 October 2023",
        rating: 5,
        comment:
          "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.",
        avatar: images.UserImage,
      },
    ],
  };
  return acc;
}, {});

export const doctorDashboardData = Object.keys(doctorDetailsMap).reduce((acc, doctorId) => {
  acc[doctorId] = {
    cards: [
      { id: "earning", label: "Total Earning", value: "$550", subText: "vs last month", trend: "+12%" },
      { id: "booking", label: "Total Booking", value: "120", subText: "vs last month", trend: "+8%" },
    ],
    earnings: [20, 26, 24, 32, 28, 36, 30, 40, 45, 38, 42, 48],
    bookings: [18, 22, 25, 30, 26, 33, 29, 35, 37, 32, 36, 44],
    categories: [
      "Jan 23",
      "Feb 23",
      "Mar 23",
      "Apr 23",
      "May 23",
      "Jun 23",
      "Jul 23",
      "Aug 23",
      "Sep 23",
      "Oct 23",
      "Nov 23",
      "Dec 23",
    ],
  };
  return acc;
}, {});

export const doctorRequests = [
  { id: "RQ01", doctorId: "08", doctorName: "Dr. John Carter", status: "Pending", requestedDate: "12/03/2024" },
  { id: "RQ02", doctorId: "09", doctorName: "Dr. Alex Rivers", status: "Pending", requestedDate: "12/03/2024" },
  { id: "RQ03", doctorId: "10", doctorName: "Dr. Chris Walker", status: "Rejected", requestedDate: "12/03/2024" },
  { id: "RQ04", doctorId: "11", doctorName: "Dr. Andrew Miles", status: "Pending", requestedDate: "12/03/2024" },
  { id: "RQ05", doctorId: "12", doctorName: "Dr. James Brown", status: "Approved", requestedDate: "12/03/2024" },
  { id: "RQ06", doctorId: "13", doctorName: "Dr. Robert Finch", status: "Pending", requestedDate: "12/03/2024" },
  { id: "RQ07", doctorId: "14", doctorName: "Dr. Smith Harper", status: "Rejected", requestedDate: "12/03/2024" },
];
export const doctorServiceDetails = (() => {
  const defaultSlots = [
    { day: "Monday", time: "08:00 AM - 05:00 PM" },
    { day: "Tuesday", time: "08:00 AM - 05:00 PM" },
    { day: "Wednesday", time: "08:00 AM - 05:00 PM" },
    { day: "Thursday", time: "08:00 AM - 05:00 PM" },
    { day: "Friday", time: "08:00 AM - 05:00 PM" },
    { day: "Saturday", time: "09:00 AM - 05:00 PM" },
    { day: "Sunday", time: "09:00 AM - 05:00 PM" },
  ];

  const defaultDescription =
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.";

  const details = {};

  Object.values(doctorServices).forEach((services) => {
    services.forEach((service) => {
      details[service.id] = {
        ...service,
        description: defaultDescription,
        slots: defaultSlots,
        banner: images.placeholder,
      };
    });
  });

  return details;
})();
