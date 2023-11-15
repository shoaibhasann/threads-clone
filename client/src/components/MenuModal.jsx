import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";
import { logout } from "../store/slices/AuthSlice.js";
import { setTheme } from "../store/slices/ThemeSlice.js";
import { clearThreadSlice } from "../store/slices/ThreadSlice.js";

function MenuModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: { username }} = useAuth()

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      dispatch(setTheme("light"));
      toast("Hello Lightness!", {
        duration: 1000,
        icon: "🌞",
        style: {
          border: "1px solid #4d4d4d",
          borderRadius: "7px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      dispatch(setTheme("dark"));
      toast("Hello Darkness!", {
        duration: 1000,
        icon: "🌛",
        style: {
          border: "1px solid #333",
          borderRadius: "7px",
          background: "#fff",
          color: "#000",
        },
      });
    }
  };

  const [isModalActive, setIsModalActive] = useState(false);
  const handleModal = () => {
    setIsModalActive((prev) => !prev);
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalActive(false);
      }
    };

    if (isModalActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalActive]);

  const handleLogout = async () => {
    const response = await dispatch(logout());
    if (response?.payload?.success) {
      dispatch(clearThreadSlice());
      navigate("/login");
    }
  };

  return (
    <div className="min-w-36" ref={modalRef} style={{ userSelect: "none" }}>
      <div className="flex justify-end items-center mb-2">
        <div
          className="text-2xl cursor-pointer flex flex-col justify-end items-end group"
          onClick={handleModal}
        >
          <div
            className={`${
              isModalActive ? "bg-black dark:bg-white" : "bg-dark-text"
            } w-6 h-[2.5px] mb-[5.5px] rounded-3xl group-hover:bg-black group-hover:dark:bg-white`}
          ></div>
          <div
            className={`${
              isModalActive ? "bg-black dark:bg-white" : "bg-dark-text"
            } w-4 h-[2.5px] rounded-3xl group-hover:bg-black group-hover:dark:bg-white`}
          ></div>
        </div>
      </div>
      <div
        className="transition-opacity"
        style={{
          opacity: isModalActive ? 1 : 0,
          transform: isModalActive ? "translateX(0)" : "translateX(100%)",
          pointerEvents: isModalActive ? "auto" : "none",
        }}
      >
        <ul className="bg-light-background dark:bg-dark-secondary text-black dark:text-white text-base font-medium shadow-xl rounded-lg">
          <li
            onClick={toggleTheme}
            className="border-b border-dark-text py-3 cursor-pointer px-6"
          >
            Switch appearance
          </li>
          <li className="border-b border-dark-text py-3 cursor-pointer px-6">
            About
          </li>
          <li className="border-b border-dark-text py-3 cursor-pointer px-6">
            <Link to={`/edit-profile/${username}`}>Edit profile</Link>
          </li>
          <li onClick={handleLogout} className="py-3 cursor-pointer px-6">
            Log out
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MenuModal;
