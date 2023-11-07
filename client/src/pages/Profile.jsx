

import { useSelector } from "react-redux";

import MetaData from "../components/MetaData";
import UserHeader from "../components/user/UserHeader";
import MainLayout from "../layouts/MainLayout";

function Profile() {

    const userData = useSelector((state) => state?.auth?.data);

  return (
    <>
      <MetaData
        title={`${userData.fullname} (@${userData.username}) on Threads`}
      />
      <MainLayout>
        <UserHeader/>
      </MainLayout>
    </>
  );
}

export default Profile;
