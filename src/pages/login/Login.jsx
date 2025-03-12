import styles from "./Login.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerImage from "../../assets/sivi-logo.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import API from "../../api";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  const logInUser = () => {
    if (email.length === 0) {
      toast.error("Username tidak boleh kosong!");
    } else if (password.length === 0) {
      toast.error("Password tidak boleh kosong!");
    } else {
      API.post("/login", {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.role);  
        navigate("/", { replace: true });
      })
      .catch(function (error) {
        console.log(error, "error");
        if (error.response && error.response.status === 401) {
          toast.error("Kredential tidak sesuai!");
        } else if (error.response && error.response.status === 402) {
          toast.error("Status pembayaran belum berubah!");
        }
      });
    }
  };

  useEffect(() => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    navigate("/", { replace: true });
  }
}, []);

  return (
    <div className={styles["login-container"]}>
      <div className={styles["logo-container"]}>
        <h2></h2>
        
        <img src={registerImage} alt="App Logo" className={styles["sivi-logo"]} />
        
        <h2></h2>
      </div>
      
      <div className={styles["login-form-container"]}>
          <h2 className={styles["headingg"]}>LOGIN</h2>

          <form className={styles["form_class"]}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="form3Example"
              className={styles["field"]}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="form3Example2"
              className={styles["field"]}
              required
            />

            <button
              type="button"
              className={styles["login-button"]}
              onClick={logInUser}
            >
              Login
            </button>
          </form>

          <p className={styles["go-to-register-text"]}>
            Belum punya akun? <span className={styles["route-to-register"]} onClick={() => navigate("/register", { replace: true })}>Register</span>
          </p>
        </div>
        
        <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}