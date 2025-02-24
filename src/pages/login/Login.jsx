import "./Login.css";
import axios from 'axios';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import registerImage from "../../assets/sivi-logo.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import API from "../../api";

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
        navigate("/");
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

  return (
    <div className="login-container">
      <div className="logo-container">
        <h2></h2>
        
        <img src={registerImage} alt="App Logo" className="sivi-logo" />
        
        <h2></h2>
      </div>
      
      <div className="login-form-container">
          <h2 className="headingg">LOGIN</h2>

          <form className="form-class">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="form3Example"
              className="field"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="form3Example2"
              className="field"
              required
            />

            <button
              type="button"
              className="login-button"
              onClick={logInUser}
            >
              Login
            </button>
          </form>

          <p className="go-to-register-text">
            Belum punya akun?<Link to="/register" className="route-to-register"> Register</Link>
          </p>
        </div>
        
        <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}