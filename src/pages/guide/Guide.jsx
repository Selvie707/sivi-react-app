import styles from "./Guide.module.css";
import React from "react";
import guideImage from "../../assets/sibi-alphabets-guide.png";

const Guide = ({ onClose }) => {
  return (
    <div className={styles["guide-container"]}>
        <button 
          className={styles["close-button"]} 
          onClick={onClose} 
          aria-label="Tutup panduan"
        >
          &times;
        </button>
        <img 
          src={guideImage} 
          alt="Panduan" 
          className={styles["guide-image"]} 
        />
    </div>
  );
};

export default Guide;
