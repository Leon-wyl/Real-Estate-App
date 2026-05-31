import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const linkClass = "transition-all duration-400 ease-in-out hover:scale-105 max-[738px]:hidden";

  return (
    <nav className="h-[100px] flex justify-between items-center">
      <div className="flex-[3] flex items-center gap-[50px]">
        <a href="/" className="font-bold text-xl flex items-center gap-2.5 transition-all duration-400 ease-in-out hover:scale-105">
          <img src="/logo.png" alt="" className="w-7" />
          <span className="max-[1024px]:hidden max-[738px]:inline">RealEstate</span>
        </a>
        <a href="/" className={linkClass}>Home</a>
        <a href="/" className={linkClass}>About</a>
        <a href="/" className={linkClass}>Contact</a>
        <a href="/" className={linkClass}>Agents</a>
      </div>
      <div className="flex-[2] flex items-center justify-end bg-[#fcf5f3] h-full max-[1024px]:bg-transparent">
        {currentUser ? (
          <div className="flex items-center font-bold">
            <img
              src={ currentUser.avatar || "/noavatar.jpg"}
              alt=""
              className="w-10 h-10 rounded-full object-cover mr-5"
            />
            <span className="max-[738px]:hidden">{currentUser.username}</span>
            <Link to="/profile" className="px-6 py-3 bg-[#fece51] cursor-pointer border-none relative ml-5">
              <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-[26px] h-[26px] flex items-center justify-center">3</div>
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login" className="px-6 py-3 m-5 transition-all duration-400 ease-in-out hover:scale-105 max-[738px]:hidden">Sign in</a>
            <a href="/register" className="px-6 py-3 m-5 bg-[#fece51] h-[50px] flex items-center transition-all duration-400 ease-in-out hover:scale-105 max-[738px]:hidden">
              Sign up
            </a>
          </>
        )}
        <div className="hidden z-[999] max-[738px]:inline ml-5">
          <img
            src="/menu.png"
            alt=""
            className="w-9 h-9 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={`absolute top-0 bg-black text-white h-screen w-1/2 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-2xl ${open ? "right-0" : "-right-1/2"}`}>
          <a href="/" className="py-2">Home</a>
          <a href="/" className="py-2">About</a>
          <a href="/" className="py-2">Contact</a>
          <a href="/" className="py-2">Agents</a>
          <a href="/" className="py-2">Sign in</a>
          <a href="/" className="py-2">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
