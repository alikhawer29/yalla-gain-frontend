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
          { path: "admin/user-management/:id/user-post", element: <UserPosts /> },


          { path: "admin/chat", element: <Chat /> },

          // Appointments //
          { path: "admin/appointments", element: <AppointmentLogs /> },
          { path: "admin/appointments/:id", element: <AppointmentDetails /> },
          // --- End --- //

          { path: "admin/notifications", element: <NotificationsAdmin /> },
          { path: "admin/*", element: <AdminErrorPage /> },
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
