import { FiEdit } from "react-icons/fi";
import { GoHeart, GoHeartFill, GoHome, GoHomeFill, GoPerson, GoPersonFill, GoSearch } from "react-icons/go";
import { NavLink, useLocation } from "react-router-dom";

function Header (){

  const location = useLocation();

  return (
    <div
      style={{ WebkitTapHighlightColor: "transparent" }}
      className="flex items-center justify-around pb-4 sm:py-3 bg-light-background dark:bg-dark-background sm:bg-opacity-30 sm:backdrop-blur-xl"
    >
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          {location.pathname === "/" ? (
            <GoHomeFill className="text-3xl" />
          ) : (
            <GoHome className="text-3xl" />
          )}
        </NavLink>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          <GoSearch className="text-3xl" />
        </NavLink>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/new-thread"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          <FiEdit className="text-3xl" />
        </NavLink>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/activity"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          {location.pathname === "/activity" ? (
            <GoHeartFill className="text-3xl" />
          ) : (
            <GoHeart className="text-3xl" />
          )}
        </NavLink>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          {location.pathname === "/profile" ? (
            <GoPersonFill className="text-3xl" />
          ) : (
            <GoPerson className="text-3xl" />
          )}
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
