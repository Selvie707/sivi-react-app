import { Navigate } from "react-router-dom";

const AdminRoute = ({ children}) => {
  const userRole = localStorage.getItem("userRole"); // Ambil role dari localStorage
  const requiredRole = "admin";

  // Jika ada role yang dibutuhkan tetapi role user tidak cocok, arahkan ke halaman Unauthorized
  if (userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;