import { useState } from "react";

import MetaData from "../components/MetaData";
import UserHeader from "../components/user/UserHeader";
import { useAuth } from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";

function Profile() {
  const { data } = useAuth();
  const [activeTab, setActiveTab] = useState("threads");


  return (
    <>
      <MetaData title={`${data.fullname} (@${data.username}) on Threads`} />
      <MainLayout>
        <UserHeader userData={data} />

        {/* navigation tabs  */}
        <div
          style={{ userSelect: "none" }}
          className="flex justify-around border-b-2 border-dark-text relative pb-3"
        >
          <h5
            onClick={() => setActiveTab("threads")}
            className={
              activeTab === "threads"
                ? "dark:text-white text-base cursor-pointer"
                : "dark:text-gray-500 text-base cursor-pointer"
            }
          >
            Threads
          </h5>
          <h5
            onClick={() => setActiveTab("reposts")}
            className={
              activeTab === "reposts"
                ? "dark:text-white text-base cursor-pointer"
                : "dark:text-gray-500 text-base cursor-pointer"
            }
          >
            Reposts
          </h5>
          <div
            className={`absolute bg-white bottom-[-2px] w-[20%] h-[2.5px] rounded-lg transition-transform duration-300 ease-in-out transform ${
              activeTab === "reposts" ? "translate-x-[120%]" : "translate-x-[-120%]"
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
              {/* Add your threads posts content here */}
              <p>Threads posts go here.</p>
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
      </MainLayout>
    </>
  );
}

export default Profile;
