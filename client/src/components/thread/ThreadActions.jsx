import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import {
  dropComment,
  likeUnlikeThread,
  repostThread,
  setFeed,
} from "../../store/slices/ThreadSlice.js";
import CommentModal from "./CommentModal.jsx";


function ThreadActions({ post }) {
  const dispatch = useDispatch();

  const {
    data: { _id: userId },
  } = useAuth();

  const { feed: posts } = useSelector((state) => state?.thread);

  const [liked, setLiked] = useState(post.likes.includes(userId));
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);

  // Function to handle like & unlike flow
  const handleLikeAndUnlike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await dispatch(likeUnlikeThread(post._id));

      if (response?.payload?.success) {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: liked
                ? p.likes.filter((like) => like !== userId)
                : [...p.likes, userId],
            };
          }
          return p;
        });

        setLiked(!liked);
        dispatch(setFeed(updatedPosts));
        setAnimateLike(true);
        setTimeout(() => setAnimateLike(false), 100);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLiking(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const theme = useTheme();

  // Handle Comment submit
  const handleComment = async (comment) => {
    if (isReplying) return;
    setIsReplying(true);

    try {
      const payload = {
        comment: comment,
        postId: post._id, // Ensure postId is passed correctly
      };

      const response = await dispatch(dropComment(payload));

      if (response?.payload?.success) {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              replies: [...p.replies, response?.payload?.newReply],
            };
          }
          return p;
        });

        dispatch(setFeed(updatedPosts));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 my-2" onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "#ff3040" : theme === "dark" ? "#fff" : "#000"}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeAndUnlike}
          className={`cursor-pointer transform ${
            animateLike ? "scale-110" : ""
          } transition-transform duration-100 ease-in-out`}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color={theme === "dark" ? "#fff" : "#000"}
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <RepostSVG postId={post._id} theme={theme} />
        <ShareSVG theme={theme} />
      </div>
      <CommentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCommentSubmit={handleComment}
      />
    </div>
  );
}

export default ThreadActions;

// Component for repost the thread
const RepostSVG = ({ theme, postId }) => {
  const dispatch = useDispatch();

  const handleRepost = async () => {
    const response = await dispatch(repostThread(postId));

    if (response?.payload?.success) {
      toast.success("Reposted", {
        style: {
          borderRadius: "7px",
          background: theme === "dark" ? "#fff" : "#000",
          color: theme === "dark" ? "#000" : "#fff",
        },
      });
    }
  };
  return (
    <svg
      aria-label="Repost"
      color={theme === "dark" ? "#fff" : "#000"}
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      className="cursor-pointer"
      onClick={handleRepost}
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
  );
};

// Component for share the thread
const ShareSVG = ({ theme }) => {
  return (
    <svg
      aria-label="Share"
      color={theme === "dark" ? "#fff" : "#000"}
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      className="cursor-pointer"
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};
