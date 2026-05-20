import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateOptions } from "../../Utils/i18nHelpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

export const Select = (props) => {
  const { t, i18n } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("");
  const children = useMemo(
    () => translateOptions(props?.children, t),
    [props?.children, t, i18n.language]
  );

  useEffect(() => {
    setSelectedValue(props.value ?? "");
  }, [props.value]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (props?.onChange) {
      props.onChange(value);
    }
  };

  const cn = props.className || "";
  const isTableStatusSelect = cn.includes("tabel-select");
  let tableStatusTone = undefined;
  if (isTableStatusSelect) {
    if (selectedValue === "1") tableStatusTone = "active";
    else if (selectedValue === "0") tableStatusTone = "inactive";
    else if (cn.includes("status1") || cn.includes("statusActive"))
      tableStatusTone = "active";
    else if (cn.includes("status0") || cn.includes("statusInactive"))
      tableStatusTone = "inactive";
  }

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
          }`.trim()}
          data-table-status={tableStatusTone}
          style={props?.style}
          onBlur={props?.onBlur}
        >
          {props?.mainLabel && <option value="">{props?.mainLabel}</option>}

          {children?.map((item) => (
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
