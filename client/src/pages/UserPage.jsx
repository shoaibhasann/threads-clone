import { useEffect } from "react"
import { RotatingLines } from "react-loader-spinner"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import MetaData from "../components/MetaData"
import Thread from "../components/thread/Thread"
import UserHeader from "../components/user/UserHeader"
import MainLayout from "../layouts/MainLayout"
import { fetchUser } from "../store/slices/UserSlice"


function UserPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(id));
  }, [dispatch, id]);

  const {
    userData: { userDetails: data, postsByUser },
    loading,
  } = useSelector((state) => state?.user);

  return (
    <>
      <MetaData title={`${data?.fullname} (@${data?.username}) on Threads`} />
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
          <>
            {data && <UserHeader userData={data} />}
            <div className="border-t border-dark-text pt-4 pb-14">
              {postsByUser &&
                postsByUser.map((post) => (
                  <Thread
                    key={post._id}
                    post={post}
                    isVerified={true}
                  />
                ))}
            </div>
          </>
        )}
      </MainLayout>
    </>
  );
}


export default UserPage;