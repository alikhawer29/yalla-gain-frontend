import { Formik } from "formik";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../../../Components/CustomButton/index.jsx";
import CustomInput from "../../../Components/CustomInput/index.jsx";
import { UserAuthLayout } from "../../../Components/Layouts/UserLayout/AuthLayout/index.jsx";
import { Select } from "../../../Components/Select/index.jsx";
import ImageUpload from "../../../Components/UploadAndDisplayImage/UploadAndDisplayImage.jsx";
import { language } from "../../../Config/TableStatus.jsx";
import { signUpUserValidationSchema } from "../../../Config/Validations.jsx";
import { usePageTitleUser } from "../../../Utils/helper.jsx";
import "./style.css";

import ReactSelect from "react-select";

const UserSignup = () => {
  usePageTitleUser("Sign Up");
  const navigate = useNavigate();

  // Convert language options to format required by ReactSelect
  const languageOptions = language
    .filter((option) => option.value !== "") // Remove the "Select language" option
    .map((option) => ({
      value: option.value,
      label: option.text,
    }));

  const handleSubmit = async (values, { resetForm }) => {
    console.log("registered", values);
    resetForm();
    navigate("/personal-details");
  };

  return (
    <>
      <UserAuthLayout authTitle="Sign up">
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            languages: [], // Changed from language to languages (array)
            nationality: "",
            gender: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: "",
            profile_pic: [],
            cover_pic: [],
          }}
          validationSchema={signUpUserValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldTouched,
            setFieldValue,
          }) => (
            <form className="mt-3" onSubmit={handleSubmit}>
              <div className="mb-3">
                <CustomInput
                  label="First Name"
                  id="first_name"
                  type="text"
                  required
                  placeholder="Enter First Name"
                  labelclass="mainLabel"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.first_name && errors.first_name}
                />
              </div>
              <div className="mb-3">
                <CustomInput
                  label="Last Name"
                  id="last_name"
                  type="text"
                  required
                  placeholder="Enter Last Name"
                  labelclass="mainLabel"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.last_name && errors.last_name}
                />
              </div>
              <div className="inputWrapper position-relative mb-3">
                <label htmlFor="languages" className="mainLabel">
                  Languages<span className="text-danger">*</span>
                </label>
                <ReactSelect
                  isMulti
                  id="languages"
                  name="languages"
                  className="multi-select"
                  classNamePrefix="select"
                  value={values.languages}
                  onChange={(selectedOptions) => {
                    setFieldValue("languages", selectedOptions);
                  }}
                  onBlur={() => setFieldTouched("languages", true)}
                  isClearable={true}
                  isSearchable={true}
                  options={languageOptions}
                  placeholder="Select Languages"
                />
                {touched.languages && errors.languages && (
                  <div className="error-message">
                    <p>{errors.languages}</p>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <CustomInput
                  label="Nationality"
                  id="nationality"
                  type="text"
                  required
                  placeholder="Enter Nationality"
                  labelclass="mainLabel"
                  value={values.nationality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.nationality && errors.nationality}
                />
              </div>
              <div className="inputWrapper position-relative">
                <Select
                  label="gender"
                  labelclass="mainLabel"
                  required
                  id="gender"
                  name="gender"
                  wrapperClass="d-block mb-3"
                  mainLabel="Select Gender"
                  value={values.gender}
                  onChange={(value) =>
                    handleChange({ target: { name: "gender", value } })
                  } // Adapting to Formik
                  onBlur={handleBlur}
                  error={touched.gender && errors.gender}
                >
                  {[
                    {
                      value: "male",
                      text: "Male",
                    },
                    {
                      value: "female",
                      text: "Female",
                    },
                  ]}
                </Select>
              </div>
              <div className="inputWrapper position-relative mb-3">
                <label htmlFor="phoneInput" className="mainLabel">
                  {" "}
                  Contact Number<span className="text-danger">*</span>
                </label>
                <PhoneInput
                  defaultCountry="US"
                  placeholder="Enter Conatct Number"
                  value={values.phone}
                  onChange={(phone) => setFieldValue("phone", phone)}
                  onBlur={() => setFieldTouched("phone", true)}
                  className="form-control"
                />
                {touched.phone && errors.phone ? (
                  <div className="error-message">
                    <p>{errors.phone}</p>
                  </div>
                ) : null}
              </div>
              <div className="mb-3">
                <CustomInput
                  label="Email Address"
                  id="email"
                  type="email"
                  required
                  placeholder="Enter Email Address"
                  labelclass="mainLabel"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />
              </div>
              <div className="mb-3">
                <CustomInput
                  label="password"
                  id="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  labelclass="mainLabel"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                />
              </div>
              <div className="mb-3">
                <CustomInput
                  label="Confirm Password"
                  id="confirm_password"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  labelclass="mainLabel"
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirm_password && errors.confirm_password}
                />
              </div>
              <div className="image-upload-style-2 mb-3">
                <ImageUpload
                  id="profile_pic"
                  label="Profile Picture"
                  placeholder="Upload Profile Picture"
                  onChange={(files) => setFieldValue("profile_pic", files)}
                  numberOfFiles={1}
                  required
                  errorFromParent={touched.profile_pic && errors.profile_pic}
                  className="image-upload-style-2"
                />
              </div>
              <div className="image-upload-style-2">
                <ImageUpload
                  id="cover_pic"
                  label="Cover Picture"
                  placeholder="Upload Cover Picture"
                  onChange={(files) => setFieldValue("cover_pic", files)}
                  numberOfFiles={1}
                  // required
                  errorFromParent={touched.cover_pic && errors.cover_pic}
                  className="image-upload-style-2"
                />
              </div>

              <div className="mt-5 text-center">
                <CustomButton
                  variant="primary"
                  className="w-100"
                  text="Next"
                  pendingText="Loading..."
                  type="submit"
                />
              </div>

              <p className="mt-4 mb-0 fw-medium text-center text-capitalize grayLightColor">
                Already have an account?
                <Link to={"/login"} className="underlineOnHover text-dark ps-1">
                  Login
                </Link>
              </p>
            </form>
          )}
        </Formik>
      </UserAuthLayout>
    </>
  );
};

export default UserSignup;
