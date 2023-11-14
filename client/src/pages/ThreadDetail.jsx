import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Comment from "../components/thread/Comment.jsx"
import Thread from "../components/thread/Thread.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

function ThreadDetail() {
  const { id } = useParams();
  const feed = useSelector((state) => state?.thread?.feed);

  const thread =
    feed &&
    feed.find((f) => {
      return f._id == id;
    });

  if (!thread) {
    // Handle the case where thread is not found
    return <p>Thread not found</p>;
  }

  return (
    <MainLayout>
      <div>
        <Thread key={thread._id} post={thread} />
        {
            thread.replies && thread.replies.length > 0 ? thread.replies.map((reply, idx) => (
                <Comment key={reply._id} reply={reply} index={idx} totalLength={thread.replies.length} postId={id} />
            )) : null
        }
      </div>
    </MainLayout>
  );
}

export default ThreadDetail;
