import { FiEdit } from "react-icons/fi";
import { GoHeart, GoHome, GoHomeFill, GoPerson, GoPersonFill, GoSearch } from "react-icons/go";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function Header (){

  const location = useLocation();

  const { data } = useAuth();

  return (
    <div
      style={{ WebkitTapHighlightColor: "transparent" }}
      className="flex items-center justify-around py-3 sm:py-3 bg-light-background dark:bg-dark-background sm:bg-opacity-90 sm:backdrop-blur-[1px]"
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
        <Link
          to="/"
          className="text-dark-text"
        >
          <GoSearch className="text-3xl" />
        </Link>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/new-thread"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          <FiEdit size={26} />
        </NavLink>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <Link
          to="/"
          className="text-dark-text"
        >
            <GoHeart className="text-3xl" />
        </Link>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to={`/${data?.username}/user/${data?._id}`}
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          {location.pathname === `/${data?.username}/user/${data?._id}` ? (
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
