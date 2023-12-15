import { AiOutlineInstagram } from "react-icons/ai";
import { useDispatch } from "react-redux";

import verifiedTick from "../../assets/verified.png";
import { useAuth } from "../../hooks/useAuth";
import { getUserData } from "../../store/slices/AuthSlice";
import { fetchUser, followUser, unfollowUser } from "../../store/slices/UserSlice";

function UserHeader({ userData }) {

  const dispatch = useDispatch();

  const { data: currentUser } = useAuth();

  const isAlreadyFollow = currentUser.following.includes(userData._id);

  const handleFollowRequest = async () => {
    await  dispatch(followUser(userData._id));
    await dispatch(fetchUser(userData._id));
    await dispatch(getUserData());
  }

  const handleUnfollowRequest = async () => {
    await dispatch(unfollowUser(userData._id));
    await dispatch(fetchUser(userData._id));
    await dispatch(getUserData());
  }

  return (
    <div className="pt-3 px-3 sm:pt-0 py-4 sm:mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-black dark:text-slate-50 font-bold text-xl sm:text-2xl tracking-wide mb-1">
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
            className="inline-block w-20 h-20 sm:w-24 sm:h-24 rounded-full"
            src={userData?.avatar?.secure_url}
            alt="User Profile Image"
          />

          {/* conditional rendering for showing blue tick  */}
          {/* {userData.subscription && 
          userData.subscription.status === "fulfilled" ? (
            <span className="absolute bottom-0 end-0 block p-2 rounded-full transform  translate-x-1/2 bg-white dark:bg-slate-900 dark:ring-slate-900">
              <img className="w-4" src={verifiedTick} alt="" />
            </span>
          ) : null} */}

          <span className="absolute bottom-0 end-0 block p-2 rounded-full transform  translate-x-1/4 bg-white dark:bg-slate-900 dark:ring-slate-900">
            <img className="w-4" src={verifiedTick} alt="verified-tick" />
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="w-2/3 dark:text-gray-50">
          {userData !== undefined ? userData.bio : "Bio not updated yet."}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {userData.follower && (
            <span className="text-[#434343] font-medium hover:underline cursor-pointer">
              {userData?.follower.length} follower
              {userData.follower.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <a href="http://instagram.com" target="_blank" rel="noreferrer">
          <AiOutlineInstagram className="dark:text-white text-3xl font-medium cursor-pointer" />
        </a>
      </div>

      <div className="my-3">
        {currentUser._id !== userData._id &&
          (isAlreadyFollow ? (
            <button
              onClick={handleUnfollowRequest}
              className="dark:bg-white dark:text-black w-full rounded-lg font-medium text-base p-1"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollowRequest}
              className="bg-black text-white dark:bg-white dark:text-black w-full rounded-lg font-medium text-base p-1"
            >
              Follow
            </button>
          ))}
      </div>
    </div>
  );
}

export default UserHeader;
