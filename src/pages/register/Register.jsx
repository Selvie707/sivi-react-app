import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Register.module.css";
import registerImage from "../../assets/sivi-logo.png";
import API from "../../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  // Fungsi untuk membatasi panjang karakter
  const handleUsernameChange = (e) => {
    if (e.target.value.length <= 20) {
      setUsername(e.target.value);
    } else {
      toast.error("Username maksimal 20 karakter!");
    }
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length <= 50) {
      setEmail(e.target.value);
    } else {
      toast.error("Email maksimal 50 karakter!");
    }
  };

  const navigate = useNavigate();

  const registerUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (username.length === 0) {
      toast.error("Username tidak boleh kosong!");
    } else if (email.length === 0) {
      toast.error("Email tidak boleh kosong!");
    } else if (!emailRegex.test(email)) {
      toast.error("Email tidak valid!");
    } else if (password.length === 0) {
      toast.error("Password tidak boleh kosong!");
    } else if (password.length < 8) {
      toast.error("Password minimal 8 karakter!");
    } else if (password !== repPassword) {
      toast.error("Password tidak cocok!");
    } else {
      const is_paid = false;
      const role = "user";

      API
        .post("/signup", {
          username: username,
          email: email,
          password: password,
          is_paid: is_paid,
          role: role,
        })
        .then(function (response) {
          console.log(response);
          toast.success("Registrasi berhasil!");
          toast.success("Cek email untuk panduan berikutnya");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        })
        .catch(function (error) {
          console.log(error, "error");
          if (error.response && error.response.status === 409) {
            toast.error("Email sudah terdaftar!");
          } else {
            toast.error("Terjadi kesalahan saat registrasi.");
          }
        });
    }
  };

  return (
    <div className={styles["register-container"]}>
      <div className={styles["logo-container"]}>
        <h2></h2>
        <img src={registerImage} alt="App Logo" className={styles["sivi-logo"]} />
        <h2></h2>
      </div>

      <div className={styles["register-form-container"]}>
        <h2 className={styles["heading"]}>REGISTER</h2>
        <form className={styles["form-class"]}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className={styles["field"]}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className={styles["field"]}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["field"]}
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            value={repPassword}
            onChange={(e) => setRepPassword(e.target.value)}
            className={styles["field"]}
            required
          />
          <button type="button" className={styles["register-button"]} onClick={registerUser}>
            Register
          </button>
        </form>
        <p className={styles["go-to-login"]}>
          Sudah punya akun? <span className={styles["route-to-login"]} onClick={() => navigate("/login", { replace: true })}>Login</span>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
