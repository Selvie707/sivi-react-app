import styles from "./ManageUserStatus.module.css";
import { useNavigate, useLocation, replace } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import API from "../../api";
import Swal from 'sweetalert2'

const ManageUserStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousPage = location.state?.from || "/";

  const handleUpdateUserStatus = (email) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Status pembayaran tidak dapat diubah kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Status Diubah!",
          text: "Status pengguna telah diubah menjadi telah bayar",
          icon: "success"
        });
        API.post("/update-user-status", { email })
          .then((response) => {
            toast.success("Status pembayaran berhasil diperbaharui!")
            setUsers(users.map(user => user.email === email ? { ...user, is_paid: true } : user));
          })
          .catch((error) => {
            toast.error("Gagal memperbaharui status pembayaran")
            console.error("Error:", error);
          });
      }
    });
  };

  const handleUpdateRole = (email) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Role tidak dapat diubah kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Role Diubah!",
          text: "Role pengguna telah diubah menjadi Admin",
          icon: "success"
        });
        API.post("/update-role", { email })
        .then((response) => {
          toast.success("Role berhasil diperbaharui!")
          setUsers(users.map(user => user.email === email ? { ...user, role: "admin" } : user));
        })
        .catch((error) => {
          toast.error("Gagal memperbaharui role")
          console.error("Error:", error);
        });
      }
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
    <div className={styles["container"]}>
      <div className={styles["heading-container"]}>
        <button className={styles["close-buttonn"]} onClick={() => navigate(previousPage, {replace: true})}>✖</button>
        <h2 className={styles["heading"]}>LIST PENGGUNA</h2>
      </div>
      
      <table border="1" className={styles["content-table"]}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Update</th>
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
                <div className={styles["update-buttons"]}>
                  {!user.is_paid && (
                    <button onClick={() => handleUpdateUserStatus(user.email)} className={styles["button-payment"]}>STATUS</button>
                  )}
                  {user.role === "user" && (
                    <button onClick={() => handleUpdateRole(user.email)} className={styles["button-role"]}>ROLE</button>
                  )}
                </div>
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
