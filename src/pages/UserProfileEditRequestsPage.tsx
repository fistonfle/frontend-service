/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import ProfileEditRequestsTable from "../components/profile-edits/ProfileEditRequestsTable";

const UserProfileEditRequestsPage = () => {
  const [profileEditRequests, setProfileEditRequests] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          url + "/profile-edit-requests"
        );
        setProfileEditRequests(response.data?.data || []);
      } catch (error: any) {
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload]);

  return (
    <MainLayout title="Member Profile Edit Requests" hideNewButton>
      <ProfileEditRequestsTable
        profileEditRequests={profileEditRequests}
        reloadProfileEditRequests={() => setReload(!reload)}
      />
    </MainLayout>
  );
};

export default UserProfileEditRequestsPage;
