import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import verifiedTick from "../../assets/verified.png";
import { useAuth } from "../../hooks/useAuth";
import { deleteThread, setFeed } from "../../store/slices/ThreadSlice";
import Dropdown from "../Dropdown";
import ThreadActions from "./ThreadActions";

// setup javascript-time-ago library
TimeAgo.addLocale(en);

function Thread({ isVerified, post, className = "", isActiveTab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  // getting current loggedin user details
  const { data } = useAuth();

  // get feed posts
  const { feed: feedPosts } = useSelector((state) => state?.thread);

  useEffect(() => {
    const calculateLineHeight = () => {
      if (imageRef.current) {
        const imageHeight = imageRef.current.getBoundingClientRect().height;
        setLineHeight(imageHeight);
      } else {
        setLineHeight(34);
      }
    };

    // Trigger the calculation when the component mounts
    calculateLineHeight();

    // Attach the event listener for window resize or other relevant events
    const handleResize = () => {
      calculateLineHeight();
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imageRef, isActiveTab]);

  if (!post || !post.postedBy) {
    // Handle the case where the post or its properties are not available
    return <h1 className="dark:text-white text-lg">Sorry, post not available</h1>;
  }

  // username posted thread post
  const username = post.postedBy.username;

  const handleDeletePost = () => {
    const isDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if(isDelete){
      const updatedPosts = feedPosts.filter((p) => p._id !== post._id);
      // delete post from server
      dispatch(deleteThread(post._id));
      // delete post from state
      dispatch(setFeed(updatedPosts));
    }
  };

  const handleEditPost = () => {
    navigate("/edit-thread", { state: post });
  }

  return (
    <div
      className={`grid grid-cols-[1fr_6fr] gap-2 mx-1 p-3 py-4 sm:p-6 bg-transparent border-b border-dark-text sm:mx-auto ${className}`}
    >
      {post && (
        <div className="thread_line_container">
          <div className="flex flex-col items-center gap-4">
            {/* First Avatar */}
            <div className="flex-shrink-0">
              {post.postedBy && post.postedBy.avatar && (
                <img
                  src={post.postedBy.avatar.secure_url}
                  alt="Avatar"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
              )}
            </div>
            {/* Thin Line */}
            <div
              style={{
                height: lineHeight + "px",
                width: "1.9px",
                background: "gray",
              }}
            ></div>
            {/* Second Avatar */}
            <div className="relative bg-transparent w-full">
              {post.replies.length === 0 && (
                <span className="w-6 h-6 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2">
                  🥱
                </span>
              )}
              {post.replies[0] && (
                <img
                  className="w-5 h-5 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 my-2"
                  src={post.replies[0].userAvatar}
                  alt="Avatar"
                />
              )}
              {post.replies[1] && (
                <img
                  className="w-5 h-5 rounded-full absolute top-full left-1/4 transform -translate-x-1/2 -translate-y-1/2"
                  src={post.replies[1].userAvatar}
                  alt="Avatar"
                />
              )}
              {post.replies[2] && (
                <img
                  className="w-5 h-5 rounded-full absolute top-full right-1/4 transform translate-x-1/2 -translate-y-1/2"
                  src={post.replies[2].userAvatar}
                  alt="Avatar"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        {post && (
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center mb-2">
              {/* Display username */}
              <Link
                to={`/${username}/user/${post.postedBy._id}`}
                className="font-medium tracking-normal dark:text-white cursor-pointer hover:underline"
              >
                {post.postedBy.username}
              </Link>
              {/* Blue tick */}
              {isVerified && (
                <img className="w-4" src={verifiedTick} alt="verified-tick" />
              )}
            </div>
            {/* Thread posted time */}
            <div className="text-dark-text text-sm font-medium flex items-center justify-center gap-3">
              <ReactTimeAgo
                date={new Date(post.createdAt).getTime()}
                locale="en-US"
                timeStyle="twitter"
              />
              {data.username === username ? (
                <Dropdown onDelete={handleDeletePost} onEdit={handleEditPost} />
              ) : null}
            </div>
          </div>
        )}

        {/* Thread content */}
        {post && post.content && (
          <p className="dark:text-white mb-2">{post.content}</p>
        )}

        {/* Thread thumbnail */}
        {post && post.thumbnail && (
          <Link to={`/${username}/thread/${post._id}`}>
            <img
              ref={imageRef}
              className="rounded-lg border border-dark-text max-h-[400px] mb-2 cursor-pointer"
              src={post.thumbnail.secure_url}
              alt="thumbnail"
            />
          </Link>
        )}

        {post && <ThreadActions post={post} />}

        <div className="h-6 text-gray-500 flex items-center justify-start gap-2">
          {post && post.replies && post.replies.length > 0 && (
            <Link
              to={`/${username}/thread/${post._id}`}
              className="cursor-pointer hover:underline"
            >
              {post.replies.length}{" "}
              {post.replies.length === 1 ? "reply" : "replies"}
            </Link>
          )}

          {post.replies.length > 0 && post.likes.length > 0 && <span>.</span>}

          {post && post.likes && post.likes.length > 0 && (
            <Link
              to={`/${username}/thread/${post._id}`}
              className="cursor-pointer hover:underline"
            >
              {post.likes.length} {"like" + (post.likes.length > 1 ? "s" : "")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Thread;
