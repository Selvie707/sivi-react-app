import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import registerImage from "../../assets/sivi-logo.png";
import API from "../../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const navigate = useNavigate();

  const registerUser = () => {
    if (username.length === 0) {
      toast.error("Username tidak boleh kosong!");
    } else if (email.length === 0) {
      toast.error("Email tidak boleh kosong!");
    } else if (password.length === 0) {
      toast.error("Password tidak boleh kosong!");
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
          setTimeout(() => navigate("/login"), 2000);
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
    <div className="register-container">
      <div className="logo-container">
        <h2></h2>
        <img src={registerImage} alt="App Logo" className="sivi-logo" />
        <h2></h2>
      </div>

      <div className="register-form-container">
        <h2 className="heading">REGISTER</h2>
        <form className="form-class">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="field"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            value={repPassword}
            onChange={(e) => setRepPassword(e.target.value)}
            className="field"
            required
          />
          <button type="button" className="register-button" onClick={registerUser}>
            Register
          </button>
        </form>
        <p className="go-to-login">
          Sudah punya akun?<Link to="/login" className="route-to-login"> Login</Link>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
