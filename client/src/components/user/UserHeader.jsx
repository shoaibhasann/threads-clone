import { AiOutlineInstagram } from "react-icons/ai";

import verifiedTick from "../../assets/verified.png";

function UserHeader() {
  return (
    <div className="sm:mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-black dark:text-slate-50 font-bold text-2xl tracking-wide mb-0.5">
            Mohd Shoaib
          </h1>
          <div className="flex gap-2 items-center ">
            <h2 className="dark:text-gray-50">shoaib.hasann</h2>
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
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            alt="Image Description"
          />
          <span className="absolute bottom-0 end-0 block p-2 rounded-full transform  translate-x-1/2 bg-white dark:bg-slate-900 dark:ring-slate-900">
            <img className="w-4" src={verifiedTick} alt="" />
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="w-2/3 dark:text-gray-50">
          Prayers 🤲🏻 for Peace in Palestine, Uniting Hearts Against
          Injustice.❤️‍🩹❤️‍🩹
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-[#434343] font-medium hover:underline cursor-pointer">33 followers</span>
        </div>
        <a href="http://instagram.com" target="_blank" rel="noreferrer">
          <AiOutlineInstagram className="dark:text-white text-3xl font-medium cursor-pointer" />
        </a>
      </div>
    </div>
  );
}

export default UserHeader;
