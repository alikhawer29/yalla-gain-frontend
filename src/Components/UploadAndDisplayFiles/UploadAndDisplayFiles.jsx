import React, { useEffect, useMemo, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { HiOutlineDocument } from "react-icons/hi2";
import Styles from "./UploadAndDisplayFiles.module.css";

const UploadAndDisplayFiles = ({
  files = [],
  className,
  label,
  required = false,
  onChange,
  numberOfFiles = 3,
  allowSameFileUpload = true,
  showNumberOfFilesText = false,
  errorFromParent = "",
  height = "",
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false); // New flag

  // Memoize files array
  const memoizedFiles = useMemo(() => files, [files]);

  // Initialize images from parent only once
  useEffect(() => {
    if (memoizedFiles.length && !initialized) {
      setSelectedFiles(memoizedFiles);
    }
    setInitialized(true);
  }, [memoizedFiles, initialized]);

  // Call onChange when files are updated, but skip initialization case
  useEffect(() => {
    if (initialized && onChange) {
      onChange(selectedFiles);
    }
  }, [selectedFiles, initialized]);

  useEffect(() => {
    setError(errorFromParent);
  }, [errorFromParent]);

  const handleFileChange = (e) => {
    const selectedFilesArray = Array.from(e.target.files);
    const validFileTypes = ["text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    e.target.value = null; // Reset input to allow selecting the same file again

    const allValid = selectedFilesArray.every((file) => validFileTypes.includes(file.type));

    if (!allValid) {
      setError("Only document files (txt, pdf, doc, docx) are allowed.");
      return;
    }

    if (selectedFilesArray.length + selectedFiles.length > numberOfFiles) {
      setError(`You can only upload up to ${numberOfFiles} files.`);
      return;
    }

    const newFiles = allowSameFileUpload
      ? selectedFilesArray
      : selectedFilesArray.filter((file) => !selectedFiles.some((f) => f.name === file.name && f.size === file.size));

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setError("");
  };

  const handleRemoveFile = (index) => {
    setError("");
    if (typeof selectedFiles[index] === "string") {
      let newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
    } else {
      setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ position: "relative" }} className={`${Styles[className]} mb-3 position-relative`}>
      <p className={Styles.fileUploaderLabel}>
        {label}
        {required ? <span className="text-danger">*</span> : ""}
      </p>

      {/* Conditionally render the selected files */}
      {!!selectedFiles.length && (
        <div className={`d-flex justify-content-start gap-2 my-3 ${Styles.displayFiles}`}>
          {selectedFiles?.map((file, index) => (
            <div key={index} style={{ height: height, position: "relative" }}>
              {typeof file === "string" ? <a target="_blank" href={file}>{file}</a> : <p>{file.name}</p>}
              <button
                type="button"
                className={Styles.fileRemoveButton}
                onClick={() => {
                  handleRemoveFile(index);
                }}
              >
                <FaXmark size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles?.length < numberOfFiles ? (
        <label style={{ height: height }} htmlFor="myDocument" className={Styles.fileUploadArea}>
          <div>
            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
              <HiOutlineDocument size={32} color="#333" />
              <p>Upload File{numberOfFiles > 1 ? "(s)" : ""}</p>
            </div>
            {/* <p>Or</p> */}
            {/* <p>Drag & Drop Document{numberOfFiles > 1 && "(s)"}</p> */}
            {numberOfFiles > 1 && showNumberOfFilesText ? <p style={{ color: "#999", fontSize: "12px" }}>Minimum 1 Maximum {numberOfFiles} Documents</p> : null}
          </div>
        </label>
      ) : (
        ""
      )}

      <input
        id="myDocument"
        style={{ opacity: 0, position: "absolute", bottom: 0, cursor: "pointer", zIndex: -1 }}
        type="file"
        multiple={numberOfFiles > 1}
        // required={required}
        name="document"
        accept=".txt,.pdf,.doc,.docx"
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

export default UploadAndDisplayFiles;
