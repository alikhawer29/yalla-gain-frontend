import React from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../CustomButton";
import { images } from "../../Assets";
import "./style.css";

const CustomModal = (props) => {
  return (
    <Modal
      className={props?.className}
      show={props?.show}
      centered
      onHide={props?.close}
      size={props?.size}
      keyboard={false}
      backdrop="static"
    >
      {/* Close button for the modal */}
      {!props?.hideClose && (
        <button className="closeButton" onClick={props?.close}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}

      <Modal.Body>
        {/* Render children if provided; otherwise, render default content */}
        {props?.children ? (
          <div className="modalContent">{props.children}</div>
        ) : (
          <div className="text-center">
            {/* Conditional images based on success or other states */}
            {props?.success ? (
              <img src={images.Check} alt="check" className="modalImage" />
            ) : props?.showReason ? (
              ""
            ) : (
              <img
                src={images.Question}
                alt="question"
                className="modalImage"
              />
            )}

            {/* Default modal content */}
            <div className="modalContent">
              {props?.heading && (
                <h2 className="modalHeading">{props?.heading}</h2>
              )}
              {props?.para && !props?.showReason && (
                <p className="modalpara">{props.para}</p>
              )}
              {/* <p className="modalpara">
                {props?.showReason ? "" : props?.para}
              </p> */}

              {/* Show reason input area if `showReason` is true */}
              {props?.showReason && (
                <div className="modalReason mb-3 text-start">
                  <h3 className="modalHeading">{props?.reasonHeading}</h3>
                  <h4 className="modalHeading fw-medium">
                    {props?.reasonSubHeading}
                  </h4>
                  <p className="mb-1 fw-medium ms-1">
                    {props?.reasonLabel} <span className="text-red">*</span>
                  </p>
                  <textarea
                    className="form-control"
                    placeholder={props?.reasonPlaceholder}
                    rows="4"
                    onChange={props?.onChange}
                    value={props?.value}
                  ></textarea>
                  {props?.errorMessage && (
                    <p className="text-danger">{props?.errorMessage}</p>
                  )}
                </div>
              )}

              {/* Render appropriate buttons based on modal state */}
              {props?.success ? (
                <CustomButton
                  onClick={props?.action ? props.action : props?.close}
                  className="primary px-5 mb-2 mt-3"
                  text={props?.btnText || "Okay"}
                />
              ) : props?.showReason ? (
                <div className="d-flex justify-content-center gap-2">
                  <CustomButton
                    onClick={props?.action}
                    variant="primary"
                    text={"Submit"}
                  />
                  <CustomButton
                    onClick={props?.close}
                    variant="secondary"
                    text={"Cancel"}
                  />
                </div>
              ) : props?.alert ? (
                <>
                  <CustomButton
                    onClick={props?.action ?? props?.close}
                    className="primary px-5 mb-2 mt-3 modalButton"
                    text="Okay"
                  />
                </>
              ) : (
                <div className="mt-4">
                  <CustomButton
                    onClick={props?.action}
                    variant="primary px-5 modalButton"
                    text="Yes"
                    className="me-2"
                  />
                  <CustomButton
                    onClick={props?.close}
                    variant="secondary px-5 modalButton"
                    text="No"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;
