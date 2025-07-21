// import { AuthLayout } from "../../../Components/Layouts/AdminLayout/Auth";
import { UserAuthLayout } from "../../../Components/Layouts/UserLayout/AuthLayout";
import LoginForm from "../../../Components/LoginForm";
import { loginValidationSchema } from "../../../Config/Validations";
import { usePageTitleUser } from "../../../Utils/helper";
import "./style.css";


const UserLogin = () => {
  usePageTitleUser("Login");
  return (
    <>
      <UserAuthLayout authTitle="Login" authMain authPara="" authLeftText="Your Journey to Emotional Wellness" dontHaveAcc>
        <LoginForm
          // actor="user"
          // apiEndpoint="/admin-api/auth/login"
          validationSchema={loginValidationSchema}
        />
      </UserAuthLayout>
  </>
  );
};

export default UserLogin;
