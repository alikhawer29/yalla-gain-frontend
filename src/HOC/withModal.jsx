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
      heading: "",
      para: "",
      action: null,
      showReason: false,
      reasonValue: "",
      errorMessage: "",
      reasonHeading: "",
      reasonSubHeading: "",
      reasonLabel: "", // Add reasonLabel in state
    });
    const reasonModal = (
      heading,
      para,
      action,
      success = false,
      showReason = false,
      reasonHeading = "",
      reasonSubHeading = "",
      reasonLabel = ""
    ) => {
      setModalState({
        currentStep: MODAL_STEPS.INITIAL,
        show: true,
        success,
        heading,
        reasonHeading,
        reasonSubHeading,
        para,
        action,
        showReason,
        reasonValue: "",
        errorMessage: "",
        reasonLabel, // Set reasonLabel
        // Reset reason value for each new modal errorMessage: "", // Clear previous error messages
      });
    };

    const showModal = (heading = null, para, action, success = false) => {
      setModalState({ heading, para, action, success, show: true });
    };

    const handleModalClose = () => {
      setModalState((prev) => ({ ...prev, show: false, action: null }));
    };

    const handleReasonChange = (e) => {
      setModalState((prev) => ({
        ...prev,
        reasonValue: e.target.value,
        errorMessage: "", // Clear error message on input change
      }));
    };

    const handleSubmit = () => {
      if (modalState.currentStep === MODAL_STEPS.INITIAL) {
        // Move to reason input step
        setModalState((prev) => ({
          ...prev,
          currentStep: MODAL_STEPS.REASON_INPUT,
        }));
      } else if (modalState.currentStep === MODAL_STEPS.REASON_INPUT) {
        // Validate reason input
        if (modalState.reasonValue.trim() === "") {
          setModalState((prev) => ({
            ...prev,
            errorMessage: "Reason is required.",
          }));
          return;
        }
        // Execute action and move to success step
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
          closeModal={handleModalClose} // ✅ Add this line
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
          showReason={modalState.currentStep === MODAL_STEPS.REASON_INPUT}
          onChange={handleReasonChange}
          value={modalState.reasonValue}
          reasonLabel={
            modalState.reasonLabel?.trim() ? modalState.reasonLabel : "Reason"
          }
          reasonPlaceholder={props?.reasonPlaceholder || "Enter reason here..."}
          btnText={props?.btnText}
          errorMessage={modalState.errorMessage}
        />
      </>
    );
  };
};

export default withModal;

//Example-1 for just confirmation

// const confirmPopup = (id, status) => {
//   showModal(
//     `Are you sure you want to ${status === "Active" ? "Inactivate" : "Activate"} this User?`, //heading
//     () => onConfirm(status, id) //action
//   );
// };

//Example-2 for confirmation with reason

// const confirmPopup = (id, status) => {
//   reasonModal(
//     "Are you sure you want to cancel this user?",  //heading
//     (reason) => onConfirm(id, reason), //action
//     false, //success
//     true, //reason
//   );
// };

// const onConfirm = async (id, status) => {
//   try {
//     reasonModal(
//       `User ${status === "Active" ? "inactivated" : "activated"
//       } successfully`, //heading
//       null, //action
//       true //sucess
//     );
//   } catch (error) {
//     console.error("Error updating user status:", error);
//   }
// };
