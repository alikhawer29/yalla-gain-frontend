import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

export default function PreventUser() {
  const { role, token } = useAuth();
  if (token && role === "user") {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
}
