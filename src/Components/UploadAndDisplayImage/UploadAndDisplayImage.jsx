import { useEffect, useMemo, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import Styles from "./UploadAndDisplayImage.module.css";
import "./style.css";
import UploadIcon from "../../Assets/images/svg/uploadIcon.svg?react";

const ImageUpload = ({
  images = [],
  className,
  label,
  placeholder = "Upload Image",
  required = false,
  onChange,
  numberOfFiles = 3,
  allowSameImageUpload = true,
  showNumberOfImagesText = false,
  errorFromParent = "",
  height = "",
  id = "0",
  imgId,
  uploaderType = "default",
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false); // New flag

  // Memoize images array
  const memoizedImages = useMemo(() => images, [images]);

  // Initialize files from parent images only once
  useEffect(() => {
    if (memoizedImages.length && !initialized) {
      setFiles(memoizedImages);
    }
    setInitialized(true);
  }, [memoizedImages, initialized]);

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
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "image/png",
    ];

    e.target.value = null; // Reset input to allow selecting the same file again

    const allValid = selectedFiles.every((file) =>
      validImageTypes.includes(file.type)
    );

    if (!allValid) {
      setError("Only image files (jpg, jpeg, webp, gif, png) are allowed.");
      return;
    }

    if (selectedFiles.length + files.length > numberOfFiles) {
      setError(`You can only upload up to ${numberOfFiles} files.`);
      return;
    }

    const newFiles = allowSameImageUpload
      ? selectedFiles
      : selectedFiles.filter(
          (file) =>
            !files.some((f) => f.name === file.name && f.size === file.size)
        );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setError("");
  };

  const handleRemoveFile = (imgId, index) => {
    // console.log(imgId, "indexxxxxxxxxxxxxxxxx");
    setError(""); // Clear error message

    if (imgId) {
      const storedToBeDelete =
        JSON.parse(localStorage.getItem("toBeDelete")) || [];

      const updatedToBeDelete = [...storedToBeDelete, imgId];
      localStorage.setItem("toBeDelete", JSON.stringify(updatedToBeDelete));
    }

    if (Array.isArray(files)) {
      // Check if files is an array
      const updatedFiles = files.filter((_, i) => i !== index); // Remove the file at the given index
      // If only one file is left, set it as a single file; otherwise, keep it as an array
      setFiles(updatedFiles.length === 1 ? updatedFiles[0] : updatedFiles);
    } else {
      setFiles([]); // If files is a single file, clear it
    }
  };

  return (
    <div style={{ position: "relative" }} className={`${Styles[className]}`}>
      {/* {(Array.isArray(files) ? files.length : files ? 1 : 0) > 0 && label && (
        <label
          className={`form-label fw-medium d-block ${
            files.length ? "mb-2" : ""
          }`}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )} */}
      {label && (
        <label
          className={`form-label fw-medium d-block ${
            files.length ? "mb-2" : ""
          }`}
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      {(Array.isArray(files) ? files.length : files ? 1 : 0) <
        numberOfFiles && (
        <label
          // className="form-label d-flex align-items-center gap-2"
          htmlFor={`myImage${id}`}
          className={`imageUploadArea`}
        >
          <div className="d-flex flex-column justify-content-center align-items-center gap-2 UploadArea">
            <UploadIcon />
            <span style={{ color: "#333", fontWeight: "500" }}>
              {placeholder}
              {/* {required ? <span className="text-danger">*</span> : ""} */}
            </span>
          </div>
        </label>
      )}

      {/* Conditionally render the selected image(s) */}
      {!!(Array.isArray(files) ? files.length : files ? 1 : 0) && (
        <div
          className={`d-flex justify-content-start gap-2 mb-3 display-image ${Styles.displayImages}`}
        >
          {(Array.isArray(files) ? files : [files]).map((image, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                style={{ height: height }}
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt="Uploaded"
                className={Styles.uploadedImage}
              />
              <button
                type="button"
                className={Styles.imageRemoveButton}
                onClick={() => {
                  handleRemoveFile(imgId, index);
                }}
              >
                <FaXmark />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        id={`myImage${id}`}
        style={{
          opacity: 0,
          position: "absolute",
          bottom: 0,
          cursor: "pointer",
          zIndex: -1,
          width: "100%",
        }}
        type="file"
        multiple={numberOfFiles > 1}
        // required={required}
        name="image"
        accept="image/jpeg,image/jpg,image/webp,image/gif,image/png"
        onChange={handleFileChange}
      />
      {error && (
        <div className="error-message ps-1 pt-1">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
