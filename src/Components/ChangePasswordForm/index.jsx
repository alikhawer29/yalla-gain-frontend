import React from "react";
import { Formik } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import { changePassword } from "../../Config/Validations";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";

const ChangePasswordForm = ({
  onSubmit,
  isSubmitting,
  errors,
  btnText = "Update",
  btnVariant = "btn btn-primary",
}) => {
  console.log(errors);
  return (
    <Formik
      initialValues={{
        current_password: "",
        password: "",
        password_confirmation: "",
      }}
      validationSchema={changePassword}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} className="password-wrap">
          <Row className="mb-3">
            <Col md={12} className="my-1">
              <CustomInput
                label="Current Password"
                labelclass="mainLabel"
                type="password"
                required
                placeholder="Enter Current Password"
                inputclass="mb-3"
                id="current_password"
                value={values.current_password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.current_password && errors.current_password}
              />
            </Col>
            <Col md={12} className="my-1">
              <CustomInput
                label="New Password"
                labelclass="mainLabel"
                type="password"
                required
                placeholder="Enter New Password"
                inputclass="mb-3"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
            </Col>
            <Col md={12} className="my-1">
              <CustomInput
                label="Confirm Password"
                labelclass="mainLabel"
                type="password"
                required
                placeholder="Confirm Password"
                inputclass="mb-3"
                id="password_confirmation"
                value={values.password_confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.password_confirmation && errors.password_confirmation
                }
              />
            </Col>
            <Col md={12} className="mt-2">
              <CustomButton
                variant={btnVariant}
                className="px-5"
                text={btnText}
                pendingText="Submitting..."
                isPending={isSubmitting}
                type="submit"
              />
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
