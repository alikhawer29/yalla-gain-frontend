import React from "react";

const FieldInput = ({ span, error, ...props }) => (
  <>
    <label htmlFor="" className={props.labelclass}>
      {props.labelname}
      {span ? <span className="red-text">*</span> : ""}
    </label>
    <input
      {...props}
      className={`site-input ${props.className ? props.className : ""}`}
    />
    {error && <div className="error-message red-text">{error}</div>}
  </>
);

export default FieldInput;
