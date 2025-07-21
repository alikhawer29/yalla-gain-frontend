import React from "react";
import { Formik } from "formik";
import { contactValidationSchema } from "../../Config/Validations";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";

const ContactForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        subject: "",
        message: "",
        phone: "",
      }}
      validationSchema={contactValidationSchema}
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
        <form onSubmit={handleSubmit}>
          <div className="col-md-12">
            <CustomInput
              label="Name"
              labelclass="mainLabel"
              type="text"
              placeholder="Enter Full Name"
              // inputclass="mainInput"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
            />
            <CustomInput
              label="Email Address"
              labelclass="mainLabel"
              type="email"
              placeholder="Enter Email Address"
              // inputclass="mainInput"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
            <CustomInput
              label="Contact No"
              labelclass="mainLabel"
              type="number"
              placeholder="Enter Contact No"
              // inputclass="mainInput"
              id="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
            />
            <CustomInput
              label="Subject"
              labelclass="mainLabel"
              type="text"
              placeholder="Enter Subject"
              // inputclass="mainInput"
              id="subject"
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.subject && errors.subject}
            />
            <CustomInput
              label="Query"
              labelclass="mainLabel"
              rows="8"
              type="textarea"
              placeholder="Write here..."
              // inputclass="mainInput"
              id="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.message && errors.message}
            />
            <CustomButton variant="primary" text="Submit" type="submit" />
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ContactForm;
