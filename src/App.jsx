import "./App.css";
import React from "react";
import Login from "./pages/login/Login.jsx";
import Learn from "./pages/learn/Learn.jsx";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/register/Register.jsx";
import Recognition from "./pages/recognition/Recognition.jsx";
import Unauthorized from "./pages/unauthorized/Unauthorized.jsx";
import ManageUserStatus from "./pages/manage-user-status/ManageUserStatus.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/manage-user-status"
          element={
            <AdminRoute>
              <ManageUserStatus />
            </AdminRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<PrivateRoute><Recognition /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
