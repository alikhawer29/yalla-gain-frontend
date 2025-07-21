import React, { useEffect, useMemo, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { HiOutlineUpload } from "react-icons/hi";
import Styles from "./UploadAndDisplayVideo.module.css";

const UploadAndDisplayVideo = ({
  videos = [],
  className,
  label,
  required = false,
  onChange,
  numberOfFiles = 3,
  allowSameVideoUpload = true,
  showNumberOfVideosText = false,
  errorFromParent = "",
  id = "0",
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false); // New flag

  // Memoize videos array
  const memoizedVideos = useMemo(() => videos, [videos]);

  // Initialize files from parent videos only once
  useEffect(() => {
    if (memoizedVideos.length && !initialized) {
      setFiles(memoizedVideos);
      setInitialized(true);
    }
    if (!memoizedVideos.length) {
      setInitialized(true);
    }
  }, [memoizedVideos, initialized]);

  // Call onChange when files are updated, but skip initialization case
  useEffect(() => {
    if (initialized && onChange) {
      onChange(files);
    }
  }, [files, initialized]);

  useEffect(() => {
    setError(errorFromParent);
  }, [errorFromParent]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    e.target.value = null; // Reset input to allow selecting the same file again

    const allValid = selectedFiles.every((file) => validVideoTypes.includes(file.type));

    if (!allValid) {
      setError("Only video files (mp4, webm, ogg) are allowed.");
      return;
    }

    if (selectedFiles.length + files.length > numberOfFiles) {
      setError(`You can only upload up to ${numberOfFiles} files.`);
      return;
    }

    const newFiles = allowSameVideoUpload ? selectedFiles : selectedFiles.filter((file) => !files.some((f) => f.name === file.name && f.size === file.size));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setError("");
  };

  const handleRemoveFile = (index) => {
    setError("");
    if (typeof files[index] === "string") {
      let newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    } else {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={`${Styles[className]} mb-3 position-relative`}>
      <p className={Styles.videoUploaderLabel}>
        {label}
        {required ? <span className="text-danger">*</span> : ""}
      </p>

      {/* Conditionally render the selected video(s) */}
      {!!files.length && (
        <div className={`d-flex justify-content-start gap-2 my-3 ${Styles.displayVideos}`}>
          {files?.map((video, index) => (
            <div key={index} style={{ position: "relative" }}>
              <video controls>
                <source src={typeof video === "string" ? video : URL.createObjectURL(video)} />
                Your browser does not support the video tag.
              </video>
              <button
                type="button"
                className={Styles.videoRemoveButton}
                onClick={() => {
                  handleRemoveFile(index);
                }}
              >
                <FaXmark />
              </button>
            </div>
          ))}
        </div>
      )}

      {files?.length < numberOfFiles ? (
        <label htmlFor={`myVideo${id}`} className={Styles.videoUploadArea}>
          <div>
            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
              <HiOutlineUpload size={32} color="#333" />
              <p>Upload Video{numberOfFiles > 1 ? "(s)" : ""}</p>
            </div>
            {numberOfFiles > 1 && showNumberOfVideosText ? <p style={{ color: "#999", fontSize: "12px" }}>Minimum 1 Maximum {numberOfFiles} Videos</p> : null}
          </div>
        </label>
      ) : (
        ""
      )}

      <input
        id={`myVideo${id}`}
        style={{ opacity: 0, position: "absolute", bottom: 0, cursor: "pointer", zIndex: -1 }}
        type="file"
        multiple={numberOfFiles > 1}
        required={required}
        name="video"
        accept="video/*"
        onChange={handleFileChange}
      />
      {error && (
        <p style={{ color: "red" }} className="mb-0 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default UploadAndDisplayVideo;
