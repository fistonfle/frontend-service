/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import ExitRequestsTable from "../components/exit/ExitRequestsTable";
import { handleApiError } from "../utils/handleApiError";

const ExitRequestsPage = () => {
  const [exitRequests, setExitRequests] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { handleLogout, user } = useContext(AppContext);

  const canApproveExitRequests =
    user?.info?.role === "PRESIDENT" || user?.info?.role === "VICE_PRESIDENT";
  const canCompleteExitRequests = user?.info?.role === "MANAGER";

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/exit-requests");
        const data = response.data?.data || [];
        const filteredData = data.filter((exitRequest: any) => {
          if (canApproveExitRequests) {
            return (
              exitRequest.status === "PENDING" ||
              exitRequest.status === "APPROVED" ||
              exitRequest.status === "REJECTED"
            );
          }
          if (canCompleteExitRequests) {
            return exitRequest.status === "APPROVED";
          }
          return true;
        });
        setExitRequests(filteredData);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload, canApproveExitRequests, canCompleteExitRequests]);

  return (
    <MainLayout title="Exit Requests" hideNewButton>
      <ExitRequestsTable
        exitRequests={exitRequests}
        reloadExitRequests={() => setReload(!reload)}
        canApproveExitRequests={canApproveExitRequests}
        canCompleteExitRequests={canCompleteExitRequests}
      />
    </MainLayout>
  );
};

export default ExitRequestsPage;
