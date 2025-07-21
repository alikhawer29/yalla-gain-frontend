import React from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

const ImageSlider = ({ images }) => {
  return (
    <AwesomeSlider>
      {images?.map((image) => (
        <div key={image.id} data-src={image.file_url}>
          <img src={image.file_url} alt={`slide-${image.id}`} />
        </div>
      ))}
    </AwesomeSlider>
  );
};

export default ImageSlider;
