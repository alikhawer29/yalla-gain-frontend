import StepThree from "../../../Components/ForgetPasswordComponents/StepThree";
import { UserAuthLayout } from "../../../Components/Layouts/UserLayout/AuthLayout";
const UserForgetPassword3 = () => {
  return (
    <UserAuthLayout
      authTitle="Forgot Password"
      authPara="Set new password for your account."
      authLeftText="Your Journey to Emotional Wellness"
      authMain
      backOption={true}
    >
      <StepThree
        apiEndpoint="/admin-api/password-recovery/update-password"
        navigateTo="/login"
      />
    </UserAuthLayout>
  );
};

export default UserForgetPassword3;
