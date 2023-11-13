import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addLocale(en);

function Comment({ reply }) {

    return (
      reply && (
        <div className="border-t border-dark-text flex justify-between items-center pt-3 pb-14 px-2 relative">
          <div className="flex gap-3">
            <img
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              src={reply.userAvatar}
              alt=""
            />
            <div>
              <Link to={`/user/${reply.userId}`} className="font-medium tracking-normal dark:text-white cursor-pointer hover:underline">
                {reply.username}
              </Link>
              <p className="dark:text-white">
               {reply.text}
              </p>
            </div>
            {/* Thread posted time */}
            <div className="text-dark-text font-medium whitespace-nowrap absolute right-3">
              <ReactTimeAgo
                date={new Date(reply.repliedAt).getTime()}
                locale="en-US"
                timeStyle="twitter"
              />
            </div>
          </div>
        </div>
      )
    );
}

export default Comment;
