
   
import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "./Components/LandingComponents/Dashboard";

const useAuth = () => {
  const user = { loggedIn: false };
  return user && user.loggedIn;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Dashboard /> : <Navigate to="/" />;
};

export default ProtectedRoutes;