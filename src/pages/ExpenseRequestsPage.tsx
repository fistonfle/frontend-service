/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";
import ExpenseRequestsTable from "../components/expense-requests/ExpenseRequestsTable";

const ExpenseRequestsPage = () => {
  const [expenseRequests, setExpenseRequests] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const { handleLogout, user } = useContext(AppContext);

  const canApproveExpenseRequests =
    user?.info?.role === "PRESIDENT" || user?.info?.role === "VICE_PRESIDENT";

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          url + "/expense-activities-requests"
        );
        const data = response.data?.data || [];
        setExpenseRequests(data);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload, canApproveExpenseRequests]);

  return (
    <MainLayout title="Expense Contribution Requests" hideNewButton>
      <ExpenseRequestsTable
        expenseRequests={expenseRequests}
        reloadExpenseRequests={() => setReload(!reload)}
        canApproveExpenseRequests={canApproveExpenseRequests}
      />
    </MainLayout>
  );
};

export default ExpenseRequestsPage;
