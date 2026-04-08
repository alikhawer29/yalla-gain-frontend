import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { images } from "../../Assets";
// A lightweight drag & drop image uploader with preview and remove
// Props: { label, required, initialUrl, onChange }
// onChange called with File|null when user selects/removes; does not auto-upload
const ImageDropzone = ({
  label = "Upload Image",
  required = false,
  initialUrl = "",
  onChange,
}) => {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null); // if null and preview set => existing url
  const inputRef = useRef(null);
  const imageIcon = images.VideoIcon;
  useEffect(() => {
    if (initialUrl) setPreview(initialUrl);
  }, [initialUrl]);

  const handleFiles = useCallback(
    (files) => {
      const f = files && files[0];
      if (!f) return;
      if (!f.type.startsWith("image/")) return; // ignore non-images
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      onChange && onChange(f);
    },
    [onChange],
  );

  const onInputChange = (e) => handleFiles(e.target.files);
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setPreview("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange && onChange(null);
  };

  return (
    <div className="image-dropzone mb-3">
      {label && (
        <label className="dropzone-label form-label">
          {label}
          {required ? <span className="text-danger">*</span> : null}
        </label>
      )}
      <div
        className={`dropzone-box ${preview ? "has-image" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => inputRef.current?.click()}
      >
        {!preview ? (
          <div className="dropzone-placeholder text-center">
            <img src={imageIcon} alt="image" className="mb-2" />
            <p className="title mb-0">Upload image</p>
            <p className="muted my-1">Or</p>
            <p className="muted mb-0">Drag & Drop image</p>
          </div>
        ) : (
          <div className="dropzone-preview">
            <img src={preview} alt="preview" />
            <button
              type="button"
              className="dropzone-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              ✕
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onInputChange}
          hidden
        />
      </div>
    </div>
  );
};

export default ImageDropzone;
