import styles from "./Navbar.module.css";
import React from "react";
import logo from "../../assets/sivi-logo.png";
import adminIcon from "../../assets/admin-logo.png";
import detectIcon from "../../assets/detect-logo.png";
import logoutIcon from "../../assets/logout-logo.png";
import learnIcon from "../../assets/learn-sign-logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };
  
  const isLearnPage = location.pathname === "/learn";
  const learnButtonIcon = isLearnPage ? detectIcon : learnIcon;
  const learnButtonTarget = isLearnPage ? "/" : "/learn";

  return (
    <div className={styles["navbar"]}>
      <img src={logo} alt="Logo" className={styles["logo"]} />
      <div className={styles["navbar-icons"]}>
        {userRole === "admin" && (
          <img 
            src={adminIcon} 
            alt="admin" 
            className={styles["icon"]} 
            onClick={() => navigate("/manage-user-status", { state: { from: location.pathname } }, { replace: true })}
            style={{ cursor: "pointer" }}
          />
        )}
        <img 
          src={learnButtonIcon}
          alt="Learn" 
          className={styles["icon"]} 
          onClick={() => navigate(learnButtonTarget, { replace: true })}
          style={{ cursor: "pointer" }} 
        />
        <img 
          src={logoutIcon} 
          alt="Logout" 
          className={styles["icon"]} 
          onClick={handleLogout} 
          style={{ cursor: "pointer" }} 
        />
      </div>
    </div>
  );
};

export default Navbar;
