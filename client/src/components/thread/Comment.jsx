import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { GoTrash } from "react-icons/go"
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import { useAuth } from "../../hooks/useAuth";
import { deleteComment, setFeed,  } from "../../store/slices/ThreadSlice";

TimeAgo.addLocale(en);

function Comment({ reply, index, totalLength, postId }) {

  const dispatch = useDispatch();

  const feed = useSelector((state) => state?.thread?.feed);

  const handleRemoveComment = async () => {
     const userConfirmed = window.confirm(
       "Are you sure you want to delete this comment?"
     );

     const data = {
      commentId: reply._id,
      postId: postId
     }

     if(userConfirmed){
      const response = await dispatch(deleteComment(data));
      
      if(response?.payload?.success){

        const updatedFeed = feed.map((f) => {
          if(f._id === postId){
            return {
              ...f,
              replies: f.replies.filter((r) => r._id !== reply._id)
            }
          }

          return f;
        });

        dispatch(setFeed(updatedFeed));
      }
     }

     return;
  }

  const { data: { _id } } = useAuth();

  const isUserComment = reply.userId && _id && reply.userId === _id;

    return (
      reply && (
        <div className="border-t border-dark-text flex justify-between items-center py-6 px-2 relative">
          <div className="flex gap-3">
            <img
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              src={reply.userAvatar}
              alt=""
            />
            <div>
              <Link
                to={`/user/${reply.userId}`}
                className="font-medium tracking-normal dark:text-white cursor-pointer hover:underline"
              >
                {reply.username}
              </Link>
              <p
                className={
                  index === totalLength - 1
                    ? "dark:text-white mb-14"
                    : "dark:text-white"
                }
              >
                {reply.text}
              </p>
            </div>
            {/* Thread posted time */}
            <div className="text-dark-text font-medium flex items-center gap-3 whitespace-nowrap absolute right-3">
              <ReactTimeAgo
                date={new Date(reply.repliedAt).getTime()}
                locale="en-US"
                timeStyle="twitter"
              />
              <GoTrash onClick={handleRemoveComment} className={ isUserComment ? "cursor-pointer" : "hidden"} />
            </div>
          </div>
        </div>
      )
    );
}

export default Comment;
