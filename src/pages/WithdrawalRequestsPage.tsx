/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import WithdrawalRequestsTable from "../components/withdrawals/WithdrawalRequestsTable";
import { handleApiError } from "../utils/handleApiError";

const WithdrawalRequestsPage = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { handleLogout, user } = useContext(AppContext);

  const canApproveWithdrawalRequests =
    user?.info?.role === "PRESIDENT" || user?.info?.role === "VICE_PRESIDENT";
  const canCompleteWithdrawalRequests = user?.info?.role === "MANAGER";

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/withdrawal-requests");
        const data = response.data?.data || [];
        const filteredData = data.filter((loanRequest: any) => {
          if (canApproveWithdrawalRequests) {
            return (
              loanRequest.status === "PENDING" ||
              loanRequest.status === "APPROVED" ||
              loanRequest.status === "REJECTED"
            );
          }
          if (canCompleteWithdrawalRequests) {
            return loanRequest.status === "APPROVED";
          }
          return true;
        });
        setWithdrawalRequests(filteredData);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload, canApproveWithdrawalRequests, canCompleteWithdrawalRequests]);

  return (
    <MainLayout title="Withdrawal Requests" hideNewButton>
      <WithdrawalRequestsTable
        withdrawalRequests={withdrawalRequests}
        reloadWithdrawalRequests={() => setReload(!reload)}
        canApproveWithdrawalRequests={canApproveWithdrawalRequests}
        canCompleteWithdrawalRequests={canCompleteWithdrawalRequests}
      />
    </MainLayout>
  );
};

export default WithdrawalRequestsPage;
