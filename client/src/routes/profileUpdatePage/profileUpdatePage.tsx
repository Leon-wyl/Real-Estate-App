import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { currentUser, updateUser } = useContext(AuthContext);

  const [avatar, setAvatar] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    const form = new FormData(e.currentTarget);

    const { username, email, password } = Object.fromEntries(form);

    try {
      const res = await apiRequest.put(`/users/${currentUser?.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-[3] flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold">Update Profile</h1>
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser?.username}
              className="p-5 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser?.email}
              className="p-5 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="p-5 rounded-md border border-gray-300"
            />
          </div>
          <button
            disabled={disabled}
            className="p-5 rounded-md border-none bg-teal-600 text-white font-bold cursor-pointer disabled:bg-[#bed9d8] disabled:cursor-not-allowed"
          >
            Update
          </button>
          {error && <span className="text-red-500">{error}</span>}
        </form>
      </div>
      <div className="flex-[2] bg-[#fcf5f3] flex flex-col gap-5 items-center justify-center max-[1024px]:hidden">
        <img
          src={
            avatar[0] || currentUser?.avatar ||
            "/noavatar.jpg"
          }
          alt=""
          className="w-1/2 object-cover"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "leonwu",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 10000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
