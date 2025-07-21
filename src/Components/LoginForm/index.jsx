import { Formik } from "formik";
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
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus(); // use your custom hook

  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    startSubmitting();
    // let currentUser;

    // currentUser =
    //   loginCredentials.email == values.email && loginCredentials.password == values.password
    //     ? (currentUser = loginCredentials)
    //     : (currentUser = false);

    const currentUser = loginCredentials.find(
      (user) => user.email === values.email && user.password === values.password
    );

    // let response = await login(apiEndpoint, values); // open this whn using backend api
    if (currentUser && currentUser.status) {
      //remove all redux when using backend APIs
      dispatch(setToken(currentUser.token));
      dispatch(setRoles(currentUser.role));
      dispatch(setData(currentUser));
      showToast(currentUser.message, "success");

      setTimeout(() => {
        if (currentUser?.role === "admin") {
          navigate(`/admin/dashboard`);
        } else if (currentUser?.role === "provider") {
          navigate(`/provider`);
        } else {
          navigate(`/`); // Default fallback route
        }
      }, 1000);

      // setTimeout(() => {
      //   navigate(currentUser.role === "admin" ? `/admin/dashboard` : `/test`);
      // }, 1000);

      // setTimeout(() => {
      //   navigate(`/admin/dashboard`);
      // }, 1000);
    } else {
      showToast(currentUser.message, "error");
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
            label="Email Address"
            id="email"
            type="email"
            required
            placeholder="Enter Email Address"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
          />
          </div>
          <CustomInput
            label="Password"
            id="password"
            type="password"
            required
            placeholder="Enter Password"
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
              label={`Remember Me`}
            />
            <Link
              to={`${actor ? "/" + actor : ""}/forget-password`}
              className="fw-light"
            >
              <button
                type="button"
                className="notButton underlineOnHover text-white text-decoration-underline fw-medium"
              >
                Forgot Password?
              </button>
            </Link>
          </div>

          <div className="mt-5 text-center">
            <CustomButton
              variant="primary"
              className="w-100"
              text="Log In"
              pendingText="Loading..."
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
