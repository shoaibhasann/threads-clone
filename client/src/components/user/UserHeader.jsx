import { AiOutlineInstagram } from "react-icons/ai";
import { useSelector } from "react-redux";

import verifiedTick from "../../assets/verified.png";

function UserHeader() {

  const userData = useSelector((state) => state?.auth?.data);

  return (
    <div className="pt-10 sm:pt-0 sm:mt-6">

      <div className="flex justify-between items-center">
        <div>

          <h1 className="text-black dark:text-slate-50 font-bold text-2xl tracking-wide mb-0.5">
            {userData?.fullname}
          </h1>

          <div className="flex gap-2 items-center ">
            <h2 className="dark:text-gray-50">{userData?.username}</h2>
            <span className="rounded-2xl dark:bg-dark-secondary text-sm px-2 py-0.5 dark:text-gray-500">
              threads.net
            </span>
          </div>
        </div>

        <div
          style={{ userSelect: "none" }}
          className="relative inline-block cursor-pointer"
        >
          <img
            className="inline-block w-24 h-24 rounded-full"
            src={userData?.avatar?.secure_url}
            alt="User Profile Image"
          />

          {/* conditional rendering for showing blue tick  */}
          {
          userData.subscription &&
          userData.subscription.status === "fulfilled" ? (
            <span className="absolute bottom-0 end-0 block p-2 rounded-full transform  translate-x-1/2 bg-white dark:bg-slate-900 dark:ring-slate-900">
              <img className="w-4" src={verifiedTick} alt="" />
            </span>
          ) : null }

        </div>
      </div>

      <div className="mb-3">
        <p className="w-2/3 dark:text-gray-50">
          { userData.bio ? userData.bio : "Bio not updated yet." }
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-[#434343] font-medium hover:underline cursor-pointer">
            {userData?.follower.length} follower{userData.follower.length > 1 ? "s" : ""}
          </span>
        </div>
        <a href="http://instagram.com" target="_blank" rel="noreferrer">
          <AiOutlineInstagram className="dark:text-white text-3xl font-medium cursor-pointer" />
        </a>
      </div>

    </div>
  );
}

export default UserHeader;
