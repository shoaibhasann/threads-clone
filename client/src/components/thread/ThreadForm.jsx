import { useEffect, useRef, useState } from "react";
import { BsImages } from "react-icons/bs"

import { useAuth } from "../../hooks/useAuth";
import MainLayout from "../../layouts/MainLayout";
import AutoExpandingTextarea from "./TextArea";

function ThreadForm() {

  // Holding Reference of parent div 
  const parentRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const parentHeight = parentRef.current.clientHeight;
    const avatarHeight = 16 * 11;
    const remainingHeight = parentHeight - avatarHeight;
    setLineHeight(remainingHeight);
  }, []);

  // Accessing user's data
  const {
    data: { avatar, username }
  } = useAuth();

  const [content, setContent] = useState("");

  const inputChange = (text) => {
    setContent(text);
  }

    useEffect(() => {
      console.log(content); // Log the updated content in a useEffect
    }, [content]);

  return (
    <MainLayout>
      <h1 className="text-xl sm:text-2xl font-semibold dark:text-white text-center mb-4">
        New Thread
      </h1>
      <div
        ref={parentRef}
        className="grid grid-cols-[1fr_6fr] gap-2 mx-1 p-3 py-4 sm:p-6 bg-white dark:bg-dark-secondary border border-dark-text max-w-[600px] sm:mx-auto rounded-xl min-h-[40vh]"
      >
        <div>
          <div className="flex flex-col items-center gap-4">
            {/* First Avatar */}
            <div className="flex-shrink-0">
              <img
                src={avatar?.secure_url}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
            </div>
            {/* Thin Line */}
            <div
              style={{
                height: lineHeight + "px",
                width: "2px",
                background: "gray",
              }}
            ></div>
            {/* Second Avatar */}
            <div className="flex-shrink-0">
              <img
                src={avatar?.secure_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full opacity-50"
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <div>
            <h2 className="font-medium tracking-normal dark:text-white">
              {username}
            </h2>
          </div>
          <AutoExpandingTextarea onChangeText={inputChange} />
          <BsImages className="mt-1 text-gray-400 text-xl" />
          <div
            className="absolute bottom-2 right-2"
            style={{ userSelect: "none" }}
          >
            <button className="bg-black dark:bg-white text-white dark:text-black rounded-3xl px-4 py-2 text-end">
              Post
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ThreadForm;
