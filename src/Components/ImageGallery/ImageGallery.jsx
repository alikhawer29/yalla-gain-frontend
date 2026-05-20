import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaXmark } from "react-icons/fa6";
import Styles from "./ImageGallery.module.css";

// images = array of urls/string
// gap = 1, 2, 3, 4, 5 (applies sebsequent Bootstrap classes)
// scaleOnHover = true or false (scales up image slightly on mouse hover)
const ImageGallery = ({
  images,
  width = "auto",
  maxWidth,
  height = "auto",
  maxHeight = "auto",
  gap = 2,
  borderRadius = 0,
  scaleOnHover = true,
  fullWidth = false,
  className,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gapMap = {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 48,
  };
  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === "ArrowLeft") {
          goToPrevious();
        } else if (e.key === "ArrowRight") {
          goToNext();
        } else if (e.key === "Escape") {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);
  // Dynamic per-row: 2 images => 2 per row, 3 => 3, >=4 => 4
  const perRow = fullWidth
    ? (Array.isArray(images) && images.length > 1
        ? Math.min(4, Math.max(2, images.length))
        : 1)
    : 1;
  const gapPx = gap ? gapMap[gap] : 8;
  const quarterWidthCalc = `calc((100% - ${(perRow - 1) * gapPx}px) / ${perRow})`;

  const multiple = Array.isArray(images) && images.length > 1;

  return (
    <div
      style={fullWidth ? { width: "100%" } : {}}
      className={`d-flex flex-wrap gap-${gap} ${className || ""}`}
    >
      {images?.map((image, i) => (
        <img
          key={i}
          src={image}
          alt="post image"
          className={`${Styles.thumbnail} ${!scaleOnHover ? Styles.noScale : ""}`}
          style={{
            objectFit: "cover",
            width: fullWidth ? quarterWidthCalc : width,
            flex: fullWidth ? `0 0 ${quarterWidthCalc}` : undefined,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            height: height,
            borderRadius: borderRadius,
          }}
          onClick={() => openModal(i)}
        />
      ))}
    
      {isModalOpen && (
        <div className={Styles.modal} onClick={closeModal}>
          <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={Styles.close} onClick={closeModal}>
              <FaXmark />
            </span>
            <img src={images[currentIndex]} alt="Selected" className={Styles.modalImage} />
            {images.length > 1 && (
              <>
                <button className={Styles.previous} onClick={goToPrevious}>
                  &#10094;
                </button>
                <button className={Styles.next} onClick={goToNext}>
                  &#10095;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
