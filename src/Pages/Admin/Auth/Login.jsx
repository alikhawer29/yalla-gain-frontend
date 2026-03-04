import { AuthLayout } from "../../../Components/Layouts/AdminLayout/Auth";
import "./style.css";
import { usePageTitle } from "../../../Utils/helper.jsx";
// import { loginValidationSchema } from "../../../Config/Validations.jsx";
import { loginValidationSchema } from "../../../Config/Validations.jsx";
import LoginForm from "../../../Components/LoginForm/index.jsx";
// import LoginForm from "../../../Components/LoginForm/index.jsx";

const AdminLogin = () => {
    usePageTitle("Login");
    return (
        <>
            <AuthLayout authTitle="admin login" authMain authPara="Please login to your account">
                <LoginForm
                    actor="admin"
                    apiEndpoint="/login"
                    validationSchema={loginValidationSchema}
                />
            </AuthLayout>
        </>
    );
};

export default AdminLogin;
