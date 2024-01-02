import { useEffect } from "react"
import { RotatingLines } from "react-loader-spinner"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import MetaData from "../components/MetaData"
import UserHeader from "../components/user/UserHeader"
import UserPost from "../components/user/UserPost"
import MainLayout from "../layouts/MainLayout"
import { getReposts } from "../store/slices/ActivitySlice"
import { fetchUser } from "../store/slices/UserSlice"


function UserPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(id));
    dispatch(getReposts(id));
  }, [dispatch, id]);

  const {
    userData: { userDetails: data, postsByUser },
    loading,
  } = useSelector((state) => state?.user);
  
  const { repostedPost } = useSelector((state) => state?.activity);

  return (
    <>
      <MetaData title={`${data?.fullname} (@${data?.username}) on Threads`} />
      <MainLayout className="pb-10">
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
          <>
            {data && <UserHeader userData={data} />}

            {/* User posts  */}
            <div>
              <UserPost threads={postsByUser} reposts={repostedPost}/>
            </div>
          </>
        )}
      </MainLayout>
    </>
  );
}


export default UserPage;