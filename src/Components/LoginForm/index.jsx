import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginCredentials, userDetail } from "../../Config/data.jsx";
import { useFormStatus } from "../../Hooks/useFormStatus.jsx";
import { useLogin } from "../../Services/Auth.jsx";
import { setData, setRoles, setToken } from "../../Store/actions.jsx";
import CustomButton from "../CustomButton/index.jsx";
import CustomInput from "../CustomInput/index.jsx";
import Toast, { showToast } from "../Toast/index.jsx";
import "./style.css";
import { Form } from "react-bootstrap";

const LoginForm = ({
    actor,
    apiEndpoint,
    validationSchema,
    additionalField,
}) => {
  const { t } = useTranslation();
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();
    const login = useLogin();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus(); // use your custom hook

    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        startSubmitting();

        try {
            // Making the login API call

            let response = await login(apiEndpoint, values);
            if (response?.data?.message == 'Login successfully') {
                // Assuming response.message contains the success message
                showToast(response.message, "success"); // Show success toast
                setTimeout(() => {
                    navigate(`/admin/dashboard`); // Navigate after successful login
                }, 1000);
            } else {
                // Fallback in case the response doesn't have message
                showToast(response.message, "error");
            }
        } catch (error) {
            // Handle error if login fails
            console.error("Error during login:", error);
            showToast(t("toast.login_error"), "error");
        }

        stopSubmitting();
    };

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                ...additionalField,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
            }) => (
                <form className="mt-3" onSubmit={handleSubmit}>
                    <Toast />
                    <div className="mb-3">
                        <CustomInput
                            label={t("auth.email")}
                            id="email"
                            type="email"
                            required
                            placeholder={t("auth.email_placeholder")}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && errors.email}
                        />
                    </div>
                    <CustomInput
                        label={t("auth.password")}
                        id="password"
                        type="password"
                        required
                        placeholder={t("auth.password_placeholder")}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && errors.password}
                    />
                    <div className="d-flex align-items-center justify-content-between mt-1 flex-wrap gap-sm-0 gap-2">
                        <Form.Check
                            type={"checkbox"}
                            name="rememberMe"
                            id="rememberMe"
                            label={t("auth.rememberMe")}
                        />
                        <Link
                            to={`${actor ? "/" + actor : ""}/forget-password`}
                            className="fw-light"
                        >
                            <button
                                type="button"
                                className="notButton underlineOnHover text-white text-decoration-underline fw-medium"
                            >
                                {t("auth.forgotPassword")}
                            </button>
                        </Link>
                    </div>

                    <div className="mt-5 text-center">
                        <CustomButton
                            variant="primary"
                            className="w-100"
                            text={t("auth.login_button")}
                            pendingText={t("auth.loading")}
                            isPending={isSubmitting}
                            type="submit"
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default LoginForm;
