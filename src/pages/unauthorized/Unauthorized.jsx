import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Unauthorized.module.css";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["unauthorized-container"]}>
      <button className={styles["close-button"]} onClick={() => navigate("/")} aria-label="Tutup unauthorized">
          &times;
        </button>
        <h2>YOU ARE UNAUTHORIZED</h2>
    </div>
  );
};

export default Unauthorized;