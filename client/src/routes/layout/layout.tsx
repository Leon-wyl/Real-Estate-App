import Navbar from "../../components/navbar/Navbar";
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="h-screen max-w-[1366px] mx-auto px-5 flex flex-col max-[1366px]:max-w-[1280px] max-[1024px]:max-w-[768px] max-[738px]:max-w-[640px]">
      <div className="">
        <Navbar />
      </div>
      <div className="h-[calc(100vh-100px)]">
        <Outlet />
      </div>
    </div>
  );
}

function RequiredAuth() {
  const { currentUser } = useContext(AuthContext);

  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="h-screen max-w-[1366px] mx-auto px-5 flex flex-col max-[1366px]:max-w-[1280px] max-[1024px]:max-w-[768px] max-[738px]:max-w-[640px]">
      <div className="">
        <Navbar />
      </div>
      <div className="h-[calc(100vh-100px)]">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout, RequiredAuth };
