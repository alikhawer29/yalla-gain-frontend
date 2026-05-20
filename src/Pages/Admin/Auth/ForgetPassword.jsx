import { useTranslation } from "react-i18next";
import { AuthLayout } from "../../../Components/Layouts/AdminLayout/Auth";
import StepOne from "../../../Components/ForgetPasswordComponents/StepOne.jsx";
import { usePageTitle } from "../../../Utils/helper.jsx";
const ForgetPassword = () => {
    usePageTitle("Forgot Password");
    return (
        <AuthLayout
            authTitle="Forgot Password"
            authPara="Enter your email address to receive a verification code"
            authLeftText="Your Journey to Emotional Wellness Starts Here"
            backOption={true}
            authMain
        >
            <StepOne
                apiEndpoint="/reset/password"
                navigateTo="/admin/forget-password2"
            />
        </AuthLayout>
    );
};

export default ForgetPassword;
