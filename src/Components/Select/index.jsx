import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

export const Select = (props) => {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    setSelectedValue(props.value || "");
  }, [props.value]);

  const handleChange = (event) => {
    const value = event.target.value;

    // setSelectedValue(value);

    if (props?.onChange) {
      props.onChange(value);
    }
  };

  return (
    <>
      {props?.label && (
        <label
          className={`cap form-label  ${
            props?.labelclass ? props?.labelclass : ""
          }`}
        >
          {props?.label}
          {props?.required ? <span className="red-text">*</span> : ""}
        </label>
      )}

      <div className={`select-container ${props.wrapperClass}`}>
        <select
          name={props?.name}
          id={props?.id}
          value={selectedValue}
          onChange={handleChange}
          className={`${props.isInputNeeded === false ? "" : "form-select"} ${
            props?.className || ""
          }`}
          style={props?.style}
          onBlur={props?.onBlur}
        >
          {props?.mainLabel && <option value="">{props?.mainLabel}</option>}

          {props?.children?.map((item) => (
            <option
              key={item?.value}
              value={item?.value}
              disabled={!item?.value}
            >
              {item?.text}
            </option>
          ))}
        </select>

        {/* <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" /> */}

        {props?.error && (
          <div className="error-message red-text">{props?.error}</div>
        )}
      </div>
    </>
  );
};
