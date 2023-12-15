import { useState } from 'react';

import Thread from '../thread/Thread.jsx';

function UserPost({ threads }) {

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
          className="flex transition-transform duration-300"
          style={{
            transform:
              activeTab === "threads" ? "translateX(0)" : "translateX(100%)",
          }}
        >
          {/* Threads posts content */}
          <div className="w-full">
            {
                threads && threads.map((thread) => (
                    <Thread key={thread._id} post={thread} isVerified={true} />
                ))
            }
          </div>
        </div>

        <div
          className="flex transition-transform duration-300"
          style={{
            transform:
              activeTab === "reposts" ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          {/* Reposts posts content */}
          <div className="w-full">
            {/* Add your reposts posts content here */}
            <p>Reposts posts go here in carousel effect.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost