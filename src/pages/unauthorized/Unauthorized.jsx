import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="unauthorized-container">
      <button className="close-button" onClick={() => navigate("/")} aria-label="Tutup unauthorized">
          &times;
        </button>
        <h2>YOU ARE UNAUTHORIZED</h2>
    </div>
  );
};

export default Unauthorized;