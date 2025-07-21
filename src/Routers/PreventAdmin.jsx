import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

export default function PreventAdmin() {
  const { role, token } = useAuth();
  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  } else {
    return <Navigate to="/admin" />;
  }
}
