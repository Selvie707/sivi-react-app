import axios from "axios";
import "./ManageUserStatus.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import API from "../../api";

const ManageUserStatus = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUpdateUserStatus = (email) => {
    API.post("/update-user-status", { email })
      .then((response) => {
        toast.success("Status pembayaran berhasil diperbaharui!")
        setUsers(users.map(user => user.email === email ? { ...user, is_paid: true } : user));
      })
      .catch((error) => {
        toast.error("Gagal memperbaharui status pembayaran")
        console.error("Error:", error);
      });
  };

  const handleUpdateRole = (email) => {
    API.post("/update-role", { email })
      .then((response) => {
        toast.success("Role berhasil diperbaharui!")
        setUsers(users.map(user => user.email === email ? { ...user, role: "admin" } : user));
      })
      .catch((error) => {
        toast.error("Gagal memperbaharui role")
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    API.get("/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
      <div className="heading-container">
        <button className="close-buttonn" onClick={() => navigate("/")}>✖</button>
        <h2 className="heading">LIST PENGGUNA</h2>
      </div>
      
      <table border="1" style={{ width: "95%", margin: "0 auto", marginTop: "52px" }} className="content-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status Pembayaran</th>
            <th>Update Status</th>
            <th>Update Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_paid ? "Telah Bayar" : "Belum Bayar"}</td>
              <td>
                {!user.is_paid && (
                  <button onClick={() => handleUpdateUserStatus(user.email)} className="button-payment">UPDATE STATUS</button>
                )}
              </td>
              <td>
                {user.role === "user" && (
                  <button onClick={() => handleUpdateRole(user.email)} className="button-role">UPDATE ROLE</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ManageUserStatus;
