import StepOne from "../../../Components/ForgetPasswordComponents/StepOne.jsx";

import { UserAuthLayout } from "../../../Components/Layouts/UserLayout/AuthLayout/index.jsx";
const UserForgetPassword = () => {
  return (
    <UserAuthLayout
      authTitle="Forgot Password"
      authPara="Enter your email to recover your password."
      authLeftText="Your Journey to Emotional Wellness"
      backOption={true}
      authMain
    >
      <StepOne
        apiEndpoint="/admin-api/password-recovery/verify-email"
        navigateTo="/forget-password2"
      />
    </UserAuthLayout>
  );
};

export default UserForgetPassword;
