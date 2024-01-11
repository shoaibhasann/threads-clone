import { useState } from "react";

import Thread from "../thread/Thread.jsx";

function UserPost({ threads, reposts }) {
  const [activeTab, setActiveTab] = useState("threads");

  return (
    <div>
      {/* navigation tabs  */}
      <div
        style={{ userSelect: "none" }}
        className="flex justify-around border-b-2 border-gray-500 dark:border-dark-text relative pb-3"
      >
        <h5
          onClick={() => setActiveTab("threads")}
          className={
            activeTab === "threads"
              ? "dark:text-white text-base font-medium cursor-pointer"
              : "text-gray-600 text-base font-medium cursor-pointer"
          }
        >
          Threads
        </h5>
        <h5
          onClick={() => setActiveTab("reposts")}
          className={
            activeTab === "reposts"
              ? "dark:text-white text-base font-medium cursor-pointer"
              : "text-gray-600 text-base font-medium cursor-pointer"
          }
        >
          Reposts
        </h5>
        <div
          className={`absolute dark:bg-white bg-black bottom-[-2px] w-[20%] h-[2.5px] rounded-lg transition-transform duration-300 ease-in-out transform ${
            activeTab === "reposts"
              ? "translate-x-[120%]"
              : "translate-x-[-120%]"
          }`}
        ></div>
      </div>

      {/* Post data for threads & reposts */}
      <div className="overflow-hidden">
        <div
          className="transition-opacity duration-300"
          style={{
            display: activeTab === "threads" ? "flex" : "none",
            opacity: activeTab === "threads" ? 1 : 0,
          }}
        >
          {/* Threads posts content */}
          <div className="w-full">
            {threads &&
              threads.map((thread) => (
                <Thread key={thread._id} post={thread} isVerified={true} />
              ))}
            {threads && threads.length === 0 && (
              <h1 className="dark:text-white text-lg text-center mt-4">
                No posts found
              </h1>
            )}
          </div>
        </div>

        <div
          className="transition-opacity duration-300"
          style={{
            display: activeTab === "reposts" ? "flex" : "none",
            opacity: activeTab === "reposts" ? 1 : 0,
          }}
        >
          {/* Reposts posts content */}
          <div className="w-full">
            {reposts &&
              reposts.map((repost) => (
                <Thread
                  key={repost._id}
                  post={repost}
                  isVerified={true}
                  isActiveTab={activeTab === "reposts"}
                />
              ))}
            {reposts && reposts.length === 0 && (
              <h1 className="dark:text-white text-lg text-center mt-4">
                No posts found
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;
