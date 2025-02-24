import "./Guide.css";
import React from "react";
import guideImage from "../../assets/sibi-alphabets-guide.png";

const Guide = ({ onClose }) => {
  return (
    <div className="guide-container">
        <button className="close-button" onClick={onClose} aria-label="Tutup panduan">
          &times;
        </button>
        <img src={guideImage} alt="Panduan" className="guide-image" />
    </div>
  );
};

export default Guide;