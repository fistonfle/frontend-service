/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";
import IncomeRequestsTable from "../components/income-requests/IncomeRequestsTable";

const IncomeRequestsPage = () => {
  const [incomeRequests, setIncomeRequests] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { handleLogout, user } = useContext(AppContext);

  const canApproveIncomeRequests =
    user?.info?.role === "PRESIDENT" || user?.info?.role === "VICE_PRESIDENT";

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          url + "/income-activities-requests"
        );
        const data = response.data?.data || [];
        setIncomeRequests(data);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload, canApproveIncomeRequests]);

  return (
    <MainLayout title="Income Saving Requests" hideNewButton>
      <IncomeRequestsTable
        incomeRequests={incomeRequests}
        reloadIncomeRequests={() => setReload(!reload)}
        canApproveIncomeRequests={canApproveIncomeRequests}
      />
    </MainLayout>
  );
};

export default IncomeRequestsPage;
