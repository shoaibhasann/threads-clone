import { FiEdit } from "react-icons/fi";
import { GoHeart, GoHome, GoPerson, GoSearch } from "react-icons/go";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function Header (){
  const username = useSelector((state) => state?.auth?.data?.username);
  return (
    <div
      style={{ WebkitTapHighlightColor: "transparent" }}
      className="flex items-center justify-around pb-4 sm:py-3 dark:bg-dark-background"
    >
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          <GoHome className="text-3xl" />
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
          <GoHeart className="text-3xl" />
        </NavLink>
      </div>
      <div className="rounded-lg cursor-pointer sm:hover:bg-gray-100 sm:dark:hover:bg-dark-secondary  sm:px-8 sm:py-4">
        <NavLink
          to={`/profile/${username}`}
          className={({ isActive }) =>
            isActive ? "dark:text-white" : "text-dark-text"
          }
        >
          <GoPerson className="text-3xl" />
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
