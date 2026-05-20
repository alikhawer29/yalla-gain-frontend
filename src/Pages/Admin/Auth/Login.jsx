import { useTranslation } from "react-i18next";
import { AuthLayout } from "../../../Components/Layouts/AdminLayout/Auth";
import "./style.css";
import { usePageTitle } from "../../../Utils/helper.jsx";
// import { loginValidationSchema } from "../../../Config/Validations.jsx";
import { loginValidationSchema } from "../../../Config/Validations.jsx";
import LoginForm from "../../../Components/LoginForm/index.jsx";
// import LoginForm from "../../../Components/LoginForm/index.jsx";

const AdminLogin = () => {
    const { t } = useTranslation();
    usePageTitle(t("common.login"));
    return (
        <>
            <AuthLayout authTitle={t("auth_pages.admin_login")} authMain authPara={t("auth_pages.login_para")}>
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
