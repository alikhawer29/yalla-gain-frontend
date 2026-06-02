import { useRoutes } from "react-router-dom";

/* Admin Routes */

import AdminErrorPage from "../Pages/Admin/ErrorPage";

import ForgetPassword from "../Pages/Admin/Auth/ForgetPassword";
import ForgetPassword2 from "../Pages/Admin/Auth/ForgetPassword2";
import ForgetPassword3 from "../Pages/Admin/Auth/ForgetPassword3";
import AdminLogin from "../Pages/Admin/Auth/Login";
import { Dashboard } from "../Pages/Admin/Dashboard";
import NotificationsAdmin from "../Pages/Admin/Notifications";
import Profile from "../Pages/Admin/Profile";
import ChangePassword from "../Pages/Admin/Profile/ChangePassword";
import EditProfile from "../Pages/Admin/Profile/EditProfile";
import UserManagement from "../Pages/Admin/UserManagement";
import UserDetails from "../Pages/Admin/UserManagement/UserDetails";
import GuestRoutes from "./GuestRoutes";
import PreventAdmin from "./PreventAdmin";
import PreventUser from "./PreventUser";
import ProtectedRoutes from "./ProtectedRoutes";

import AppointmentDetails from "../Pages/Admin/AppointmentLogs/AppointmentDetails";
import AppointmentLogs from "../Pages/Admin/AppointmentLogs/AppointmentLogs";

import MainLayout from "../Components/Layouts/UserLayout/MainLayout/index";

/* User Routes */
import UserForgetPassword from "../Pages/User/Auth/ForgetPassword";
import UserForgetPassword2 from "../Pages/User/Auth/ForgetPassword2";
import UserForgetPassword3 from "../Pages/User/Auth/ForgetPassword3";
import Home from "../Pages/User/Home";

import AboutUs from "../Pages/User/AboutUs";
import UserLogin from "../Pages/User/Auth/Login";
import UserSignup from "../Pages/User/Auth/Signup";
import ContactUs from "../Pages/User/ContactUs";
import UserNotifications from "../Pages/User/Notifications";
import UserProfile from "../Pages/User/Profile";
import UserChangePassword from "../Pages/User/Profile/UserChangePassword";
import UserEditProfile from "../Pages/User/Profile/UserEditProfile";

import PersonalDetails from "../Pages/User/Auth/PersonalDetails";
import ErrorPage from "../Pages/User/ErrorPage";
import UserPosts from "../Pages/Admin/UserManagement/UserPosts";
import Chat from "../Pages/Admin/Chat/Chat";
import SubscriptionLogs from "../Pages/Admin/SubscriptionManagement/SubscriptionLogs";
import PlanManagement from "../Pages/Admin/SubscriptionManagement/PlanManagement";
import PlanAdd from "../Pages/Admin/SubscriptionManagement/PlanAdd";
import PlanView from "../Pages/Admin/SubscriptionManagement/PlanView";
import PlanEdit from "../Pages/Admin/SubscriptionManagement/PlanEdit";
import CommissionManagement from "../Pages/Admin/CommissionManagement";
import PayoutManagement from "../Pages/Admin/PayoutManagement";
import QueryManagement from "../Pages/Admin/QueryManagement";
import QueryView from "../Pages/Admin/QueryManagement/View";
import ComplaintManagement from "../Pages/Admin/ComplaintManagement";
import ComplaintView from "../Pages/Admin/ComplaintManagement/View";
import ReportsManagement from "../Pages/Admin/ReportsManagement";
import PaymentLogs from "../Pages/Admin/PaymentLogs";
import ReportBookingView from "../Pages/Admin/ReportsManagement/BookingView";
import ReportNewsfeedView from "../Pages/Admin/ReportsManagement/NewsfeedView";
import ReportPostView from "../Pages/Admin/ReportsManagement/PostView";
import FAQsManagement from "../Pages/Admin/FAQsManagement";
import FAQAdd from "../Pages/Admin/FAQsManagement/Add";
import FAQEdit from "../Pages/Admin/FAQsManagement/Edit";
import ContentManagement from "../Pages/Admin/ContentManagement";
import ContentView from "../Pages/Admin/ContentManagement/View";
import ContentAdd from "../Pages/Admin/ContentManagement/Add";
import ContentEdit from "../Pages/Admin/ContentManagement/Edit";
import VideoAdd from "../Pages/Admin/ContentManagement/Videos/Add";
import VideoView from "../Pages/Admin/ContentManagement/Videos/View";
import VideoEdit from "../Pages/Admin/ContentManagement/Videos/Edit";
import InAppCoinManagement from "../Pages/Admin/YallaCoins";
import CoinManagement from "../Pages/Admin/YallaCoins/Manage";
import ChallengeManagement from "../Pages/Admin/ChallengeManagement";
import ChallengeAdd from "../Pages/Admin/ChallengeManagement/Add";
import ChallengeView from "../Pages/Admin/ChallengeManagement/View";
import ChallengeEdit from "../Pages/Admin/ChallengeManagement/Edit";
import ServiceCategoryManagement from "../Pages/Admin/ServiceCategoryManagement";
import ServiceCategoryAdd from "../Pages/Admin/ServiceCategoryManagement/Add";
import ServiceCategoryView from "../Pages/Admin/ServiceCategoryManagement/View";
import ServiceCategoryEdit from "../Pages/Admin/ServiceCategoryManagement/Edit";
import DoctorManagement from "../Pages/Admin/DoctorManagement";
import DoctorDetails from "../Pages/Admin/DoctorManagement/Details";
import DoctorDashboard from "../Pages/Admin/DoctorManagement/Dashboard";
import DoctorReviews from "../Pages/Admin/DoctorManagement/Reviews";
import DoctorServices from "../Pages/Admin/DoctorManagement/Services";
import DoctorServiceView from "../Pages/Admin/DoctorManagement/ServiceView";
import DoctorRequests from "../Pages/Admin/DoctorManagement/Requests";
import DoctorRequestView from "../Pages/Admin/DoctorManagement/RequestView";
import TrainerManagement from "../Pages/Admin/TrainerManagement";
import TrainerDetails from "../Pages/Admin/TrainerManagement/Details";
import TrainerDashboard from "../Pages/Admin/TrainerManagement/Dashboard";
import TrainerReviews from "../Pages/Admin/TrainerManagement/Reviews";
import TrainerServices from "../Pages/Admin/TrainerManagement/Services";
import TrainerServiceView from "../Pages/Admin/TrainerManagement/ServiceView";
import TrainerRequests from "../Pages/Admin/TrainerManagement/Requests";
import TrainerRequestView from "../Pages/Admin/TrainerManagement/RequestView";
import ConsultationFeeManagement from "../Pages/Admin/ConsultationFeeManagement";

const roles = {
  admin: "admin",
  user: "user",
};

// Refactor code - Change layout implementation
const routes = [
  {
    path: "/",
    // element: <ScrollToTop />,
    children: [
      {
        element: <GuestRoutes admin />,
        children: [
          { path: "admin", element: <AdminLogin /> },
          { path: "admin/login", element: <AdminLogin /> },
          { path: "admin/forget-password", element: <ForgetPassword /> },
          { path: "admin/forget-password2", element: <ForgetPassword2 /> },
          { path: "admin/forget-password3", element: <ForgetPassword3 /> },
          { path: "admin/*", element: <PreventAdmin /> },
        ],
      },
      {
        element: <ProtectedRoutes admin roles={[roles.admin]} />,
        children: [
          { path: "admin/*", element: <PreventAdmin /> },
          { path: "admin/dashboard", element: <Dashboard /> },
          { path: "admin/profile", element: <Profile /> },
          { path: "admin/edit-profile", element: <EditProfile /> },
          { path: "admin/change-password", element: <ChangePassword /> },

          // User Mangement //
          { path: "admin/user-management", element: <UserManagement /> },
          { path: "admin/user-management/:id", element: <UserDetails /> },
          {
            path: "admin/user-management/:id/user-post",
            element: <UserPosts />,
          },

          { path: "admin/chat", element: <Chat /> },

          // Appointments //
          { path: "admin/appointments", element: <AppointmentLogs /> },
          { path: "admin/appointments/:id", element: <AppointmentDetails /> },
          // --- End --- //

          // Subscription Management
          { path: "admin/subscriptions", element: <SubscriptionLogs /> },
          { path: "admin/subscriptions/plans", element: <PlanManagement /> },
          { path: "admin/subscriptions/plans/add", element: <PlanAdd /> },
          { path: "admin/subscriptions/plans/:id", element: <PlanView /> },
          { path: "admin/subscriptions/plans/:id/edit", element: <PlanEdit /> },

          // Commission Management
          {
            path: "admin/commission-management",
            element: <CommissionManagement />,
          },

          // Payout Management
          { path: "admin/payout-management", element: <PayoutManagement /> },

          // Doctor Management
          { path: "admin/doctor-management", element: <DoctorManagement /> },
          {
            path: "admin/doctor-management/requests",
            element: <DoctorRequests />,
          },
          {
            path: "admin/doctor-management/requests/:id",
            element: <DoctorRequestView />,
          },
          {
            path: "admin/doctor-management/:id/dashboard",
            element: <DoctorDashboard />,
          },
          {
            path: "admin/doctor-management/:id/reviews",
            element: <DoctorReviews />,
          },
          {
            path: "admin/doctor-management/:id/services",
            element: <DoctorServices />,
          },
          {
            path: "admin/doctor-management/:id/services/:serviceId",
            element: <DoctorServiceView />,
          },
          { path: "admin/doctor-management/:id", element: <DoctorDetails /> },
          { path: "admin/trainer-management", element: <TrainerManagement /> },
          {
            path: "admin/trainer-management/requests",
            element: <TrainerRequests />,
          },
          {
            path: "admin/trainer-management/requests/:id",
            element: <TrainerRequestView />,
          },
          {
            path: "admin/trainer-management/:id/dashboard",
            element: <TrainerDashboard />,
          },
          {
            path: "admin/trainer-management/:id/reviews",
            element: <TrainerReviews />,
          },
          {
            path: "admin/trainer-management/:id/services",
            element: <TrainerServices />,
          },
          {
            path: "admin/trainer-management/:id/services/:serviceId",
            element: <TrainerServiceView />,
          },
          { path: "admin/trainer-management/:id", element: <TrainerDetails /> },

          // Query Management
          { path: "admin/query-management", element: <QueryManagement /> },
          { path: "admin/query-management/:id", element: <QueryView /> },

          // Complaint Management
          {
            path: "admin/complaint-management",
            element: <ComplaintManagement />,
          },
          {
            path: "admin/complaint-management/:id",
            element: <ComplaintView />,
          },

          // Reports Management
          { path: "admin/reports-management", element: <ReportsManagement /> },
          {
            path: "admin/reports-management/booking/:id",
            element: <ReportBookingView />,
          },
          {
            path: "admin/reports-management/newsfeed/:id",
            element: <ReportNewsfeedView />,
          },
          {
            path: "admin/reports-management/newsfeed/:id/post",
            element: <ReportPostView />,
          },

          // Payment Logs
          { path: "admin/payment-logs", element: <PaymentLogs /> },

          // Consultation Fee Management
          {
            path: "admin/consultation-fee-management",
            element: <ConsultationFeeManagement />,
          },

          // FAQs Management
          { path: "admin/faqs-management", element: <FAQsManagement /> },
          { path: "admin/faqs-management/add", element: <FAQAdd /> },
          { path: "admin/faqs-management/:id/edit", element: <FAQEdit /> },

          // Service Category Management
          {
            path: "admin/service-category-management",
            element: <ServiceCategoryManagement />,
          },
          {
            path: "admin/service-category-management/add",
            element: <ServiceCategoryAdd />,
          },
          {
            path: "admin/service-category-management/:id",
            element: <ServiceCategoryView />,
          },
          {
            path: "admin/service-category-management/:id/edit",
            element: <ServiceCategoryEdit />,
          },

          // Content Management
          { path: "admin/content-management", element: <ContentManagement /> },
          { path: "admin/content-management/add", element: <ContentAdd /> },
          { path: "admin/content-management/:id", element: <ContentView /> },
          {
            path: "admin/content-management/:id/edit",
            element: <ContentEdit />,
          },
          {
            path: "admin/content-management/:id/videos/add",
            element: <VideoAdd />,
          },
          {
            path: "admin/content-management/videos/:videoId",
            element: <VideoView />,
          },
          {
            path: "admin/content-management/videos/:videoId/edit",
            element: <VideoEdit />,
          },

          // Yalla Coin Logs
          { path: "admin/yalla-coins", element: <InAppCoinManagement /> },
          { path: "admin/yalla-coins/manage", element: <CoinManagement /> },

          { path: "admin/notifications", element: <NotificationsAdmin /> },
          { path: "admin/*", element: <AdminErrorPage /> },

          // Challenge management
          { path: "admin/challenges", element: <ChallengeManagement /> },
          { path: "admin/challenges/add", element: <ChallengeAdd /> },
          { path: "admin/challenges/:id", element: <ChallengeView /> },
          { path: "admin/challenges/:id/edit", element: <ChallengeEdit /> },
        ],
      },
      {
        element: <GuestRoutes user />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "", element: <Home /> },
              { path: "about-us", element: <AboutUs /> },
              { path: "contact-us", element: <ContactUs /> },
            ],
          },
          {
            element: <MainLayout />,
            children: [
              {
                element: <PreventUser />, // Wrap provider routes with PreventProvider
                children: [
                  { path: "/signup", element: <UserSignup /> },
                  { path: "/personal-details", element: <PersonalDetails /> },
                  { path: "/login", element: <UserLogin /> },
                  { path: "/forget-password", element: <UserForgetPassword /> },
                  {
                    path: "/forget-password2",
                    element: <UserForgetPassword2 />,
                  },
                  {
                    path: "/forget-password3",
                    element: <UserForgetPassword3 />,
                  },
                ],
              },
            ],
          },
          { path: "*", element: <ErrorPage /> },
        ],
      },
      {
        element: <ProtectedRoutes user roles={[roles.user]} />,
        children: [
          // { path: "/", element: <Home /> },
          {
            element: <MainLayout />,
            children: [
              { path: "/profile", element: <UserProfile /> },
              { path: "/edit-profile", element: <UserEditProfile /> },
              { path: "/change-password", element: <UserChangePassword /> },

              { path: "/notifications", element: <UserNotifications /> },

              // { path: "", element: <Home /> },
            ],
          },
          { path: "*", element: <ErrorPage /> },
        ],
      },
      {
        path: "*",
        element: <h2>404</h2>,
        // element: <GlobalErrorPage />,
      },
    ],
  },
];

const Routers = () => {
  const element = useRoutes(routes);
  return element;
};

export default Routers;
