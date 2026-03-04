import React, { useEffect, useRef, useState } from "react";
import "./style.css";

// Simple drag & drop video uploader with preview
// Props: { label, required, initialUrl, onChange }
const VideoDropzone = ({ label = "Upload Video", required = false, initialUrl = "", onChange }) => {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialUrl) setPreview(initialUrl);
  }, [initialUrl]);

  const onSelect = (f) => {
    if (!f || !f.type?.startsWith("video/")) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    onChange && onChange(f);
  };

  const onInputChange = (e) => onSelect(e.target.files?.[0]);
  const onDrop = (e) => { e.preventDefault(); onSelect(e.dataTransfer.files?.[0]); };
  const onDragOver = (e) => { e.preventDefault(); };
  const removeVideo = () => { setFile(null); setPreview(""); if (inputRef.current) inputRef.current.value = ""; onChange && onChange(null); };

  return (
    <div className="video-dropzone mb-3">
      {label && (
        <label className="dropzone-label form-label">
          {label}
          {required ? <span className="text-danger">*</span> : null}
        </label>
      )}
      <div className={`dropzone-box ${preview ? "has-video" : ""}`} onClick={() => inputRef.current?.click()} onDrop={onDrop} onDragOver={onDragOver}>
        {!preview ? (
          <div className="dropzone-placeholder">
            <div className="icon" />
            <p className="title">Upload Video</p>
            <p className="muted">Or Drag & Drop Video</p>
          </div>
        ) : (
          <div className="dropzone-preview">
            <video src={preview} controls />
            <button type="button" className="dropzone-remove" onClick={(e) => { e.stopPropagation(); removeVideo(); }}>✕</button>
          </div>
        )}
        <input ref={inputRef} type="file" accept="video/*" onChange={onInputChange} hidden />
      </div>
    </div>
  );
};

export default VideoDropzone;

