import React, { useState } from "react";
import CustomModal from "../Components/CustomModal";

const MODAL_STEPS = {
  INITIAL: 0,
  REASON_INPUT: 1,
  SUCCESS: 2,
};

const withModal = (WrappedComponent) => {
  return (props) => {
    const [modalState, setModalState] = useState({
      currentStep: MODAL_STEPS.INITIAL,
      show: false,
      success: false,
      alert: false,
      heading: "",
      para: "",
      action: null,
      showReason: false,
      reasonValue: "",
      errorMessage: "",
      reasonHeading: "",
      reasonSubHeading: "",
      reasonLabel: "",
      reasonPlaceholder: "",
      hideCancel: false,
    });

    const reasonModal = (
      heading,
      para,
      action,
      success = false,
      showReason = false,
      reasonHeading = "",
      reasonSubHeading = "",
      reasonLabel = "",
      reasonPlaceholder = "",
      hideCancel = false
    ) => {
      setModalState({
        currentStep: showReason ? MODAL_STEPS.REASON_INPUT : MODAL_STEPS.INITIAL,
        show: true,
        success,
        alert: false,
        heading,
        reasonHeading,
        reasonSubHeading,
        para,
        action,
        showReason,
        reasonValue: "",
        errorMessage: "",
        reasonLabel,
        reasonPlaceholder,
        hideCancel,
      });
    };

    /**
     * @param success When true, shows success check + primary Okay.
     * @param alert When true (and not success), shows single Okay — use for informational errors.
     */
    const showModal = (
      heading = null,
      para,
      action,
      success = false,
      alert = false,
    ) => {
      setModalState((prev) => ({
        ...prev,
        heading,
        para,
        action,
        success,
        alert: Boolean(alert) && !success,
        show: true,
        showReason: false,
        currentStep: MODAL_STEPS.INITIAL,
      }));
    };

    const handleModalClose = () => {
      setModalState((prev) => ({ ...prev, show: false, action: null }));
    };

    const handleReasonChange = (e) => {
      setModalState((prev) => ({
        ...prev,
        reasonValue: e.target.value,
        errorMessage: "",
      }));
    };

    const handleSubmit = () => {
      if (modalState.currentStep === MODAL_STEPS.INITIAL) {
        setModalState((prev) => ({
          ...prev,
          currentStep: MODAL_STEPS.REASON_INPUT,
        }));
      } else if (modalState.currentStep === MODAL_STEPS.REASON_INPUT) {
        if (modalState.reasonValue.trim() === "") {
          setModalState((prev) => ({
            ...prev,
            errorMessage: "Reason is required.",
          }));
          return;
        }
        if (modalState.action) {
          modalState.action(modalState.reasonValue);
        }
        setModalState((prev) => ({
          ...prev,
          currentStep: MODAL_STEPS.SUCCESS,
        }));
      }
    };

    return (
      <>
        <WrappedComponent
          {...props}
          showModal={showModal}
          reasonModal={reasonModal}
          closeModal={handleModalClose}
        />
        <CustomModal
          show={modalState.show}
          close={handleModalClose}
          action={modalState.showReason ? handleSubmit : modalState.action}
          heading={modalState.heading}
          reasonHeading={modalState.reasonHeading}
          reasonSubHeading={modalState.reasonSubHeading}
          para={modalState.para}
          success={modalState.success}
          alert={modalState.alert}
          showReason={modalState.currentStep === MODAL_STEPS.REASON_INPUT}
          onChange={handleReasonChange}
          value={modalState.reasonValue}
          reasonLabel={
            modalState.reasonLabel?.trim() ? modalState.reasonLabel : "Reason"
          }
          reasonPlaceholder={
            modalState.reasonPlaceholder?.trim()
              ? modalState.reasonPlaceholder
              : props?.reasonPlaceholder || "Enter reason here..."
          }
          hideCancel={modalState.hideCancel}
          btnText={props?.btnText}
          errorMessage={modalState.errorMessage}
        />
      </>
    );
  };
};

export default withModal;
