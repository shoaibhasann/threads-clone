import { useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BsImages } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import AutoExpandingTextarea from "../components/thread/TextArea";
import { useAuth } from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";
import { editThread } from "../store/slices/ThreadSlice";

function EditThread() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Holding Reference of parent div
  const parentRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useLayoutEffect(() => {
    const parentHeight = parentRef.current.clientHeight;
    const avatarHeight = 16 * 11;
    const remainingHeight = parentHeight - avatarHeight;
    setLineHeight(remainingHeight);
  }, [parentRef]);

  // Accessing user's data
  const {
    data: { avatar, username, _id: userId },
  } = useAuth();
  
  // Acessing post data
  const { state } = useLocation();

  const [content, setContent] = useState(state?.content);
  const [previewImage, setPreviewImage] = useState(state?.thumbnail?.secure_url);
  const [thumbnail, setThumbnail] = useState(undefined);
  const oldContent = state?.content;

  const inputChange = (text) => {
    setContent(text);
  };  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        setPreviewImage(reader.result);
        setThumbnail(file);
      });
    }
  };

  // Editing thread
  const handleEditThread = async (e) => {
    e.preventDefault();

    const contentChanged = content !== oldContent;
    let thumbanilChanged = false;

    if(typeof thumbnail === 'object' && thumbnail !== null){
        thumbanilChanged = true;
    }

    if(!contentChanged && !thumbanilChanged){
        toast.error("No changes made");
        return;
    }

    const threadData = new FormData();

    if (contentChanged) {
      threadData.append("content", content);
    }
    if (thumbanilChanged) {
      threadData.append("thumbnail", thumbnail);
    }

    try {
       const response = await dispatch(
         editThread({
           data: threadData,
           threadId: state?._id,
         })
       );

      if (response?.payload?.success) {
        navigate(`/${username}/user/${userId}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } 
  };

  return (
    <MainLayout>
      <h1 className="text-xl sm:text-2xl font-semibold dark:text-white text-center mb-4">
        Edit Thread
      </h1>
      <div
        ref={parentRef}
        className="grid grid-cols-[1fr_6fr] gap-2 mx-1 p-3 py-4 sm:p-6 bg-white dark:bg-dark-secondary border border-dark-text max-w-[600px] sm:mx-auto rounded-xl min-h-[40vh]"
      >
        <div className="thread_line_container">
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
        <form onSubmit={handleEditThread}>
          <div>
            <h2 className="font-medium tracking-normal dark:text-white">
              {username}
            </h2>
          </div>
          <AutoExpandingTextarea defaultValue={content} onChangeText={inputChange} />
          <label htmlFor="thumbnail">
            <BsImages className="mt-1 text-gray-400 text-xl cursor-pointer" />
          </label>
          <input
            id="thumbnail"
            type="file"
            className="hidden"
            onChange={handleImageUpload}
          />
          {previewImage && (
            <div className="mt-4 h-56 relative">
              <img
                className="w-full h-full object-cover"
                src={previewImage}
                alt="Preview-Image"
              />
              <img
                src="./cancel.png"
                alt="cancel"
                onClick={() => setPreviewImage(undefined)}
                className="mt-1 w-5 cursor-pointer absolute top-0.5 right-1"
              />
            </div>
          )}
          <div className="flex justify-end mt-4" style={{ userSelect: "none" }}>
            <button
              type="submit"
              className="bg-black dark:bg-white text-white dark:text-black rounded-3xl px-4 py-2 font-medium"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default EditThread;
