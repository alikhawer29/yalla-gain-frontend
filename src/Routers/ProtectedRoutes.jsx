import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const ProtectedRoutes = (props) => {
  const { role, token } = useAuth();

  if (token) {
    if (props?.roles?.includes(role)) {
      return <Outlet />;
    } else {
      return <Navigate to={role + "/dashboard"} />;
    }
  } else if (props?.admin) {
    return <Navigate to="/admin/" />;
  } else if (props?.user) {
    return <Navigate to="/" />;
  } else if (props?.provider) {
    return <Navigate to="/provider/login" />; // Redirect provider to login
  } else {
    return <Navigate to="/admin/login" />;
  }
};

export default ProtectedRoutes;
