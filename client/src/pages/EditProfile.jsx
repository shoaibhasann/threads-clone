import { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { getUserData } from "../store/slices/AuthSlice.js";
import { updateProfile } from "../store/slices/UserSlice.js";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: { fullname, username, bio, avatar },
  } = useAuth();

  const [userDetails, setUserDetails] = useState({
    fullname: fullname,
    username: username,
    bio: bio,
    avatar: undefined,
    previewImage: avatar.secure_url,
  });

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        setUserDetails({
          ...userDetails,
          previewImage: reader.result,
          avatar: file,
        });
      });
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;

    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (userDetails.fullname !== fullname) {
      formData.append("fullname", userDetails.fullname);
    }

    if (userDetails.username !== username) {
      formData.append("username", userDetails.username);
    }

    if (userDetails.bio !== bio) {
      formData.append("bio", userDetails.bio);
    }

    if (userDetails.avatar !== undefined) {
      formData.append("avatar", userDetails.avatar);
    }

    await dispatch(updateProfile(formData));

    await dispatch(getUserData());

    navigate("/profile");
  };

  return (
    <div className="flex overflow-x-auto items-center justify-center h-[100vh] bg-dark-secondary">
      <form
        noValidate
        encType="multipart/form-data"
        onSubmit={handleEditProfile}
        className="flex flex-col justify-center gap-3 p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_#4d4d4d] rounded-lg relative"
      >
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-white absolute top-6 left-4 text-xl cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            {userDetails.previewImage && (
              <img
                className="w-16 rounded-full"
                src={userDetails.previewImage}
                alt="Threads"
              />
            )}
            <label htmlFor="avatar">
              <BiSolidEdit className="text-white text-xl absolute top-0 right-0" />
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="hidden"
              onChange={handleImage}
            />
          </div>
          <h1 className="text-center text-2xl font-bold">Update Profile</h1>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fullname" className="font-semibold">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Enter your fullname.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={userDetails.fullname}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-semibold">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={userDetails.username}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold">
            Bio
          </label>
          <textarea
            type="text"
            name="bio"
            id="bio"
            placeholder="Enter your bio.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={userDetails.bio}
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-green-600 hover:bg-green-500 rounded-md transition-all ease-in-out duration-300 py-2 font-semibold text-lg cursor-pointer flex justify-center "
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
