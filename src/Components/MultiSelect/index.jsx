import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select",
  required = false,
  error,
  labelclass = "",
  wrapperClass = "",
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    const isSelected = value.some((item) => item.value === option.value);
    let newValue;
    if (isSelected) {
      newValue = value.filter((item) => item.value !== option.value);
    } else {
      newValue = [...value, { ...option, percentage: "" }];
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const removeOption = (val) => {
    const newValue = value.filter((item) => item.value !== val);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`multi-select-container ${wrapperClass}`} ref={dropdownRef}>
      {label && (
        <label className={`cap form-label ${labelclass}`}>
          {label}
          {required && <span className="red-text">*</span>}
        </label>
      )}

      <div className="multi-select-wrapper">
        <div
          className={`multi-select-trigger ${isOpen ? "open" : ""} ${error ? "error-border" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="ms-placeholder">{placeholder}</span>
          <FontAwesomeIcon icon={faChevronDown} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
        </div>

        {isOpen && (
          <div className="multi-select-dropdown">
            {options.map((option) => {
              const isSelected = value.some((item) => item.value === option.value);
              return (
                <div
                  key={option.value}
                  className={`multi-select-item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleOption(option)}
                >
                  <div className={`custom-checkbox ${isSelected ? "checked" : ""}`}>
                    {isSelected && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="selected-tags">
        {value.map((item) => {
          // Ensure item has the expected structure
          if (!item || typeof item !== 'object' || !item.value) {
            return null;
          }
          return (
            <div key={item.value} className="tag">
              <span>{item.text || String(item.value)}</span>
              <button type="button" onClick={() => removeOption(item.value)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          );
        })}
      </div>

      {error && <div className="error-message red-text">{error}</div>}
    </div>
  );
};

export default MultiSelect;
