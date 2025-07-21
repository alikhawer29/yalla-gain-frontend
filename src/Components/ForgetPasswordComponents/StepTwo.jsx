import { Formik } from "formik";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotCode } from "../../Config/Validations";
import { useFormStatus } from "../../Hooks/useFormStatus";
import { post } from "../../Services/Api";
import { getEmail, usePageTitleUser } from "../../Utils/helper";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import Toast, { showToast } from "../Toast";
import "./style.css";

const StepTwo = ({ apiEndpoint, resendEndpoint, navigateTo }) => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [data, setForgotPasswordData] = useState({});
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  usePageTitleUser("Forgot Password");
  const handleSubmit = async (values) => {
    setTimeout(() => {
      navigate(navigateTo);
    }, 1000);
    startSubmitting();
    // setCode(values);
    // let email = getEmail();
    // values.email = email.email;
    // let response = await post(apiEndpoint, values);
    // if (response.status) {
    //   showToast(response.message, "success");
    //   setTimeout(() => {
    //     navigate(navigateTo);
    //   }, 1000);
    // } else {
    //   stopSubmitting();
    //   showToast(response.message, "error");
    // }
    stopSubmitting();
  };

  const resendCode = async (e) => {
    e.preventDefault();
    setLoad(true);
    let email = getEmail();
    data.email = email.email;
    let response = await post(resendEndpoint, data);
    if (response.status) {
      showToast(response.message, "success");
      setLoad(false);
    } else {
      setLoad(false);
      showToast(response.message, "error");
    }
  };

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={forgotCode}
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
            label="Verification Code"
            id="code"
            placeholder="Enter Verification Code"
            labelclass="mainLabel"
            value={values.code}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.code && errors.code}
          />
          <div className="d-flex align-items-baseline justify-content-between mt-1">
            <p className="text-dark">00:58</p>
            <button
              type="button"
              className="underlineOnHover notButton green_color"
              onClick={resendCode}
            >
              {load ? "Sending..." : "Resend Code"}
            </button>
          </div>
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

StepTwo.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  resendEndpoint: PropTypes.string.isRequired,
  navigateTo: PropTypes.string.isRequired,
};

export default StepTwo;
