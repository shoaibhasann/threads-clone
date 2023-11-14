

import MetaData from "../components/MetaData";
import UserHeader from "../components/user/UserHeader";
import { useAuth } from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";

function Profile() {

    const { data } = useAuth();

  return (
    <>
      <MetaData
        title={`${data.fullname} (@${data.username}) on Threads`}
      />
      <MainLayout>
        <UserHeader userData={data} />
      </MainLayout>
    </>
  );
}

export default Profile;
