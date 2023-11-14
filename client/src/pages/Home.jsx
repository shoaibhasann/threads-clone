import { useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import Thread from "../components/thread/Thread.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { getFeed } from "../store/slices/ThreadSlice.js";

function Home() {

const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

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
          {posts &&
            posts.length > 0 &&
            posts.map((post) =>
              post ? (
                <Thread key={post._id} isVerified={true} post={post} />
              ) : null
            )}
        </div>
      )}
    </MainLayout>
  );
}

export default Home;
