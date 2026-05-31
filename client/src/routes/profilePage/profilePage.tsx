import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import { useNavigate, Link } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const { updateUser, currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-full max-[1024px]:flex-col max-[1024px]:overflow-scroll">
      <div className="flex-[3] overflow-y-scroll pb-[50px] max-[1024px]:flex-none max-[1024px]:h-max">
        <div className="pr-[50px] flex flex-col gap-[50px] max-[1024px]:pr-0">
          <div className="flex items-center justify-between">
            <h1 className="font-light text-2xl">User Information</h1>
            <Link to="/profile/update">
              <button className="px-6 py-3 bg-[#fece51] cursor-pointer border-none">Update Profile</button>
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <span className="flex items-center gap-5">
              Avatar:
              <img
                src={currentUser?.avatar || "/noavatar.jpg"}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            </span>
            <span className="flex items-center gap-5">
              Username: <b>{currentUser?.username}</b>
            </span>
            <span className="flex items-center gap-5">
              E-mail: <b>{currentUser?.email}</b>
            </span>
            <button
              onClick={handleLogout}
              className="w-[100px] bg-teal-600 border-none text-white py-[10px] px-5 cursor-pointer rounded-md"
            >
              Logout
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-light text-2xl">My List</h1>
            <Link to="/add">
              <button className="px-6 py-3 bg-[#fece51] cursor-pointer border-none">Create New Post</button>
            </Link>
          </div>
          <List />
          <div className="flex items-center justify-between">
            <h1 className="font-light text-2xl">Saved List</h1>
          </div>
          <List />
        </div>
      </div>
      <div className="flex-[2] bg-[#fcf5f3] h-full max-[1024px]:flex-none max-[1024px]:h-max">
        <div className="px-5 h-full">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
