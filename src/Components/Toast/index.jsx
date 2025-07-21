import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = () => {
  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export const showToast = (message, type) => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else if (type === "info") {
    toast.info(message);
  } else {
    toast(message);
  }
};

export default Toast;
