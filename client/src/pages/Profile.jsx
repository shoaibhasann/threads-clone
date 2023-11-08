

import MetaData from "../components/MetaData";
import UserHeader from "../components/user/UserHeader";
import { useAuth } from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";

function Profile() {

    const { data: { fullname, username }} = useAuth();

  return (
    <>
      <MetaData
        title={`${fullname} (@${username}) on Threads`}
      />
      <MainLayout>
        <UserHeader/>
      </MainLayout>
    </>
  );
}

export default Profile;
