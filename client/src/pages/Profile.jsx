import { useSelector } from "react-redux";

import MetaData from "../components/MetaData";
import UserHeader from "../components/user/UserHeader";
import MainLayout from "../layouts/MainLayout";

function Profile() {
    const { username, fullname } = useSelector((state) => state?.auth?.data);

  return (
    <>
      <MetaData
        title={`${fullname} (@${username}) on Threads`}
      />
      <MainLayout>
        <UserHeader />
      </MainLayout>
    </>
  );
}

export default Profile;
