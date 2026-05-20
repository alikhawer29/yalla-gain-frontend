import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { forgotEmail } from "../../Config/Validations";
import { useFormStatus } from "../../Hooks/useFormStatus";
import { setEmail, usePageTitleUser } from "../../Utils/helper";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import Toast, { showToast } from "../Toast";
import "./style.css";
import { post } from "../../Services/Api";

const StepOne = ({ apiEndpoint, navigateTo }) => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    usePageTitleUser("Forgot Password");
    const handleSubmit = async (values) => {
        startSubmitting();
        setEmail(values);
        let response = await post(apiEndpoint, { via: "email", 'email': values.email });
        if (response.status) {
            showToast(response?.message, "success");
            setTimeout(() => {
                navigate(navigateTo);
            }, 1000);
        } else {
            stopSubmitting();
            showToast(response?.errors?.email[0], "error");
        }
        // navigate(navigateTo);
        stopSubmitting();
    };

    return (
        <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotEmail}
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
                <form onSubmit={handleSubmit} className="mt-4">
                    <Toast />
                    <CustomInput
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter Email Address"
                        labelclass="mainLabel"
                        // inputclass="mainInput mainInputLogIn"
                        value={values.email}
                        onChange={handleChange}
                        required
                        onBlur={handleBlur}
                        error={touched.email && errors.email}
                    />
                    <div className="mt-4 text-center">
                        <CustomButton
                            type="submit"
                            variant="primary"
                            className="w-100"
                            text="Continue"
                            isPending={isSubmitting}
                            pendingText="Loading..."
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
};

StepOne.propTypes = {
    apiEndpoint: PropTypes.string.isRequired,
    navigateTo: PropTypes.string.isRequired,
};

export default StepOne;
