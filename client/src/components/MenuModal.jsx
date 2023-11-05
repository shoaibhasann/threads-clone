import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setTheme } from "../store/slices/ThemeSlice.js";

function MenuModal() {

  const dispatch = useDispatch();
  
  const theme = useSelector((state) => state.theme.themeMode);
  
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      dispatch(setTheme("dark"));
    } else {
      dispatch(setTheme("light"));
    }
  }, []);
  
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  
  const toggelTheme = () => {
    if(theme === "dark"){
      dispatch(setTheme("light"));
    } else{
      dispatch(setTheme("dark"));
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

  return (
    <div className="min-w-36" ref={modalRef}>
      <div className="flex justify-end items-center mb-2">
        <div
          style={{
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            outline: "none",
          }}
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
      <div className={!isModalActive ? "hidden" : "block"}>
        <ul
          style={{
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            outline: "none",
          }}
          className="bg-light-background dark:bg-dark-secondary text-black dark:text-white text-base font-medium shadow-xl rounded-lg"
        >
          <li
            onClick={toggelTheme}
            className="border-b border-dark-text py-3 cursor-pointer px-6"
          >
            Switch appearance
          </li>
          <li className="border-b border-dark-text py-3 cursor-pointer px-6">
            About
          </li>
          <li className="border-b border-dark-text py-3 cursor-pointer px-6">
            Report a problem
          </li>
          <li className="py-3 cursor-pointer px-6">Log out</li>
        </ul>
      </div>
    </div>
  );
}

export default MenuModal;
