import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./profileUpdatePage.scss";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { currentUser, updateUser } = useContext(AuthContext);

  const [avatar, setAvatar] = useState(currentUser?.avatar);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true)
    const form = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(form); // Object.fromEntries() method transforms a list of key-value pairs into an object.

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar,
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span className="error">{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={
            avatar ||
            "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          }
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "leonwu",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 10000000,
            folder: "avatars",
          }}
          setAvatar={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
