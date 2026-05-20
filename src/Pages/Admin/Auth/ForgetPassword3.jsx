import { useTranslation } from "react-i18next";
import StepThree from "../../../Components/ForgetPasswordComponents/StepThree";
import { AuthLayout } from "../../../Components/Layouts/AdminLayout/Auth";
import { usePageTitle } from "../../../Utils/helper";
const ForgetPassword3 = () => {
  usePageTitle("Forgot Password");
  return (
    <AuthLayout
      authTitle="Forgot Password"
      authPara="Set new password for your account"
      authLeftText="Your Journey to Emotional Wellness Starts Here"
      authMain
      backOption={true}
    >
      <StepThree apiEndpoint="/set/password" navigateTo="/admin" />
    </AuthLayout>
  );
};

export default ForgetPassword3;
