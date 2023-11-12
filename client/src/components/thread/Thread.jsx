import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import verifiedTick from "../../assets/verified.png";
import ThreadActions from "./ThreadActions";

TimeAgo.addLocale(en);

function Thread({ isVerified, post }) {
  const parentRef = useRef(null);

  const [lineHeight, setLineHeight] = useState(0);

  useLayoutEffect(() => {
    const calculateLineHeight = () => {
      const parentHeight = parentRef.current.clientHeight;
      const avatarHeight = 159; // Assuming this is the height of the avatar
      const remainingHeight = parentHeight - avatarHeight;
      setLineHeight(remainingHeight);
    };

    // Delay the calculation to ensure the DOM has rendered
    const timeoutId = setTimeout(calculateLineHeight, 0);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, [parentRef]);

  return (
    <div
      ref={parentRef}
      className="grid grid-cols-[1fr_6fr] gap-2 mx-1 p-3 py-4 sm:p-6 bg-transparent border-b border-dark-text sm:mx-auto"
    >
      <div className="thread_line_container">
        <div className="flex flex-col items-center gap-4">
          {/* First Avatar */}
          <div className="flex-shrink-0">
            <img
              src={post.postedBy.avatar.secure_url}
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
            {post.replies && post.replies.length > 0 ? (
              <img
                src={post?.replies[0]?.userAvatar}
                alt="Avatar"
                className="w-5 h-5 rounded-full"
              />
            ) : (
              "🥱"
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center mb-2">
            {/* Display username  */}
            <h1 className="font-medium tracking-normal dark:text-white">
              {post.postedBy.username}
            </h1>
            {/* Blue tick  */}
            {isVerified ? (
              <img className="w-4" src={verifiedTick} alt="verified-tick" />
            ) : null}
          </div>
          {/* Thread posted time  */}
          <div className="text-dark-text font-medium">
            <ReactTimeAgo
              date={new Date(post.createdAt).getTime()}
              locale="en-US"
              timeStyle="twitter"
            />
          </div>
        </div>

        {/* Thread content */}
        {post.content && <p className="dark:text-white mb-2">{post.content}</p>}

        {/* Thread thumbnail */}
        {post.thumbnail && (
          <Link to={`/post/${post._id}`}>
            <img
              className="rounded-lg border border-dark-text max-h-[400px] mb-2"
              src={post.thumbnail.secure_url}
              alt="thumbnail"
            />
          </Link>
        )}

        <ThreadActions post={post} />

        <div className="h-6 text-gray-500 flex items-center justify-start gap-2">
          {post.replies.length > 0 && (
            <Link
              to={`/post/${post._id}`}
              className="cursor-pointer hover:underline"
            >
              {post.replies.length}{" "}
              {post.replies.length === 1 ? "reply" : "replies"}
            </Link>
          )}

          {post.replies.length > 0 && post.likes.length > 0 && <span>.</span>}

          {post.likes.length > 0 && (
            <Link to={`/post/${post._id}`} className="cursor-pointer hover:underline">
              {post.likes.length} {"like" + (post.likes.length > 1 ? "s" : "")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Thread;
