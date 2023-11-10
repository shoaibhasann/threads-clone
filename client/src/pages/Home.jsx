import { RotatingLines } from "react-loader-spinner";
import { useSelector } from "react-redux";

import Thread from "../components/thread/Thread.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

function Home() {
  // const [showFeed, setShowFeed] = useState(true);

  // const handleTogglePosts = () => {
  //   setShowFeed(!showFeed);
  // }

  // const postsToDisplay = showFeed ?
  const { feed: posts, loading } = useSelector((state) => state?.thread);

  return (
    <MainLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[65vh]">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="24"
            visible={true}
          />
        </div>
      ) : (
        <div className="pb-20 sm:pb-4 sm:py-4 border-t border-dark-text">
          {posts.map((post) => (
            <Thread
              key={post._id}
              username={post.postedBy.username}
              content={post.content}
              avatar={post.postedBy.avatar}
              comments={post.comments}
              isVerified={true}
              createdAt={post.createdAt}
              thumbnail={post.thumbnail}
              userId={post.postedBy._id}
              reactions={post.reactions}
              post={post}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default Home;
