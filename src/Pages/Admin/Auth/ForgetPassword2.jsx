import { useTranslation } from "react-i18next";
import { AuthLayout } from "../../../Components/Layouts/AdminLayout/Auth";
import StepTwo from "../../../Components/ForgetPasswordComponents/StepTwo";
import { usePageTitle } from "../../../Utils/helper";
const ForgetPassword2 = () => {
  usePageTitle("Forgot Password");
  return (
    <AuthLayout
      authTitle="Forgot Password"
      authPara="An email has been sent to you with a verification code. Please enter it here."
      authLeftText="Your Journey to Emotional Wellness Starts Here"
      backOption={true}
      authMain
    >
      <StepTwo
        apiEndpoint="/verify/code"
        resendEndpoint="/reset/password"
        navigateTo="/admin/forget-password3"
      />
    </AuthLayout>
  );
};

export default ForgetPassword2;
