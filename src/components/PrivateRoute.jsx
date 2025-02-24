import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children}) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Jika tidak login, arahkan ke halaman login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;