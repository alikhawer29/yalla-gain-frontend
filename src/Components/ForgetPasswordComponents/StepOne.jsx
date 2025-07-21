import { Formik } from "formik";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { forgotEmail } from "../../Config/Validations";
import { useFormStatus } from "../../Hooks/useFormStatus";
import { usePageTitleUser } from "../../Utils/helper";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import Toast from "../Toast";
import "./style.css";

const StepOne = ({ apiEndpoint, navigateTo }) => {
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  usePageTitleUser("Forgot Password");
  const handleSubmit = async (values) => {
    startSubmitting();
    setTimeout(() => {
      navigate(navigateTo);
    }, 1000);
    // setEmail(values);
    // let response = await post(apiEndpoint, values);
    // if (response.status) {
    //     showToast(response.message, "success");
    // setTimeout(() => {
    //     navigate(navigateTo);
    // }, 1000);
    // } else {
    //     stopSubmitting();
    //     showToast(response?.errors?.email[0], "error")
    // }
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
