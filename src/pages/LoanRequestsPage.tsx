/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import LoanRequestsTable from "../components/loans/LoanRequestsTable";
import { handleApiError } from "../utils/handleApiError";

const LoanRequestsPage = () => {
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { handleLogout, user } = useContext(AppContext);

  const canApproveLoanRequests =
    user?.info?.role === "PRESIDENT" || user?.info?.role === "VICE_PRESIDENT";
  const canCompleteLoanRequests = user?.info?.role === "MANAGER";

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/loan-requests");
        const data = response.data?.data || [];
        const filteredData = data.filter((loanRequest: any) => {
          if (canApproveLoanRequests) {
            return (
              loanRequest.status === "PENDING" ||
              loanRequest.status === "APPROVED" ||
              loanRequest.status === "REJECTED"
            );
          }
          if (canCompleteLoanRequests) {
            return loanRequest.status === "APPROVED";
          }
          return true;
        });
        setLoanRequests(filteredData);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload, canApproveLoanRequests, canCompleteLoanRequests]);

  return (
    <MainLayout title="Loan Requests" hideNewButton>
      <LoanRequestsTable
        loanRequests={loanRequests}
        reloadLoanRequests={() => setReload(!reload)}
        canApproveLoanRequests={canApproveLoanRequests}
        canCompleteLoanRequests={canCompleteLoanRequests}
      />
    </MainLayout>
  );
};

export default LoanRequestsPage;
