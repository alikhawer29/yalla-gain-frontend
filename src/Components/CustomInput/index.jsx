import { useState } from "react";
import "./style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const CustomInput = (props) => {
  const [typePass, setTypePass] = useState(true);
  const IconToBeUsed = props?.rightIcon;
  const TextTobeUsed = props?.rightText;

  const togglePassType = () => {
    setTypePass(!typePass);
  };
  const { label, labelclass, required, type, inputclass, wrapperClass, showInline, rightText, rightTextClass, rightIcon, error, ...inputProps } = props;
  return (
    <>
      <div className={`inputWrapper position-relative ${props.wrapperClass}`}>
        <div className={`${props?.showInline === true ? "inlineLabel" : ""}`}>
          {props?.label && (
            <label
              htmlFor={props?.id || props?.name}
              className={`form-label ${props?.labelclass || ""}`}
              // className={props?.labelclass}
            >
              {props?.label}
              {props?.required ? <span className="text-danger">*</span> : ""}
            </label>
          )}
          {props?.type === "password" ? (
            <div className="passwordWrapper">
              <input {...inputProps} type={typePass ? "password" : "text"} className={`form-control ${props.inputclass && props.inputclass}`} />
              <button type="button" className="eyeButton" onClick={togglePassType}>
                <FontAwesomeIcon icon={typePass ? faEyeSlash : faEye} />
              </button>
            </div>
          ) : props?.type === "textarea" ? (
            <>
              <textarea
                placeholder={props?.placeholder}
                id={props?.id}
                name={props?.name}
                rows={props?.rows}
                cols={props?.cols}
                className={`form-control ${props.inputclass && props.inputclass}`}
                onChange={props?.onChange}
                value={props?.value}
                onBlur={props?.onBlur}
              />
            </>
          ) : (
            <div style={{ position: "relative", width: "100%" }}>
              <input type={type} {...inputProps} className={`form-control ${props.inputclass && props.inputclass}`} />
              {IconToBeUsed ? (
                <div className={`right-icon`}>
                  <IconToBeUsed color={props?.iconColor} />
                </div>
              ) : null}
              {TextTobeUsed ? (
                <div className="right-text">
                  <p className={rightTextClass}>{rightText}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {props?.error && (
          <div className="error-message red-text">
            <p className="mb-0">{props?.error}</p>
          </div>
        )}
      </div>
    </>
  );
};
export default CustomInput;
