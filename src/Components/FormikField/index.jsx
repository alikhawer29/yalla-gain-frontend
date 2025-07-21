import React from "react";
import { Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
const FormikField = ({ name, righticon, type, min, max, label, as = "input", placeholder, rows, className, labelClass, required }) => (
  <div className="col-xl-12 col-md-12 mb-3 position-relative">
    <label className={labelClass}>
      {label}
      {required ? <span className="text-danger">*</span> : ""}
    </label>
    <Field
      as={as}
      name={name}
      type={type}
      min={min}
      max={max}
      placeholder={placeholder}
      rows={rows}
      className={`${className} ${type === "number" ? "hiddenArrows" : ""}`}
    />
    {righticon && <FontAwesomeIcon icon={faDollar} className="doller" />}
    <ErrorMessage name={name} component="div" className="errorText red-text" />
  </div>
);

export default React.memo(FormikField);
