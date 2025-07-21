import StepTwo from "../../../Components/ForgetPasswordComponents/StepTwo";
import { UserAuthLayout } from "../../../Components/Layouts/UserLayout/AuthLayout";
const UserForgetPassword2 = () => {
  return (
    <UserAuthLayout
      authTitle="Forgot Password"
      authPara="Enter verification code sent to your email address."
      authLeftText="Your Journey to Emotional Wellness"
      backOption={true}
      authMain
    >
      <StepTwo
        apiEndpoint="/admin-api/password-recovery/verify-code"
        resendEndpoint="/admin-api/password-recovery/verify-email"
        navigateTo="/forget-password3"
      />
    </UserAuthLayout>
  );
};

export default UserForgetPassword2;
