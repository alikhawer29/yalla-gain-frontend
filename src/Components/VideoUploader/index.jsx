import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FiUploadCloud } from "react-icons/fi";
import './index.css';

const VideoUploader = ({ label = "Video", onChange, errorFromParent, name, setFieldValue }) => {
  const [videoPreview, setVideoPreview] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      if (setFieldValue) {
        setFieldValue(name, file);
      } else {
        onChange && onChange(e); // Fallback if setFieldValue not used
      }
    }
  };

  const handleRemove = () => {
    setVideoPreview(null);
    if (setFieldValue) {
      setFieldValue(name, "");
    }
  };

  return (
    <div className="mb-3 position-relative">
      {label && <label className="form-label fw-medium">{label}</label>}

      <div
        className={`video-upload-box ${videoPreview ? "p-0" : "p-3"} ${errorFromParent ? "border-danger" : ""}`}
        style={{
          border: `1px solid ${errorFromParent ? "#dc3545" : "#dbdbdb"}`,
          borderRadius: "15px",
          textAlign: "center",
          position: "relative",
          cursor: "pointer",
        }}
      >
        {videoPreview ? (
          <>
            <video className="p-0" controls style={{ width: "100%", borderRadius: "10px" }}>
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button type="button" className="videoRemoveButton" onClick={handleRemove}>
              <FaXmark className="me-1" />
            </button>
          </>
        ) : (
          <>
            <label htmlFor={name} style={{ cursor: "pointer" }}>
              <div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    margin: "0 auto",
                    background: "#d9efff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiUploadCloud size={24} color="#2196f3" />
                </div>
                <p className="mt-2 mb-0 fw-medium">Upload Video</p>
              </div>
            </label>
            <input type="file" id={name} name={name} accept="video/*" style={{ display: "none" }} onChange={handleVideoChange} />
          </>
        )}
      </div>

      {errorFromParent && (
        <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
          {errorFromParent}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
