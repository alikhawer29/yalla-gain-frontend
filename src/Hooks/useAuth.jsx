import { useSelector } from "react-redux";

export const useAuth = () => {
  const token = useSelector((state) => state?.token?.token);
  const role = useSelector((state) => state?.role?.role);
  const user = useSelector((state) => state?.data?.data);
  return {
    token,
    role,
    user,
  };
};
