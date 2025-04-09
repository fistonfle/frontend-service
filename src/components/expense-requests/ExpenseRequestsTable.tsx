/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/functions";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type ExpenseRequest = {
  id: string;
  date: string;
  activity: string;
  amount: number;
  description: string;
  status: string;
  isBond: boolean;
  bondStartDate: string;
  bondEndDate: string;
};
type ExpenseRequestsTableProps = {
  expenseRequests: ExpenseRequest[];
  reloadExpenseRequests: () => void;
  canApproveExpenseRequests: boolean;
};

const ExpenseRequestsTable: React.FC<ExpenseRequestsTableProps> = ({
  expenseRequests,
  reloadExpenseRequests,
  canApproveExpenseRequests,
}) => {
  const [approvingExpenseRequest, setApprovingExpenseRequest] = React.useState<
    string | null
  >(null);
  const [rejectingExpenseRequest, setRejectingExpenseRequest] = React.useState<
    string | null
  >(null);
  const { handleLogout } = React.useContext(AppContext);

  const approveExpenseRequest = async (requestIdToApprove: string) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }
    try {
      setApprovingExpenseRequest(requestIdToApprove);
      setRejectingExpenseRequest(null);
      const response = await axiosInstance.put(
        url + `/expense-activities-requests/${requestIdToApprove}/approve`
      );
      console.log(response.data);
      toast.success("Expense Contribution Request approved successfully");
      setApprovingExpenseRequest(null);
      reloadExpenseRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setApprovingExpenseRequest(null);
    }
  };

  const rejectExpenseRequest = async (requestIdToReject: string) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }
    try {
      setRejectingExpenseRequest(requestIdToReject);
      setApprovingExpenseRequest(null);
      const response = await axiosInstance.put(
        url + `/expense-activities-requests/${requestIdToReject}/reject`
      );
      console.log(response.data);
      toast.success("Expense Contribution request rejected successfully");
      setRejectingExpenseRequest(null);
      reloadExpenseRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setRejectingExpenseRequest(null);
    }
  };

  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[14%]">Activity</div>
        <div className="text-left w-[9%]">Date</div>
        <div className="text-left w-[14%]">Amount</div>
        <div className="text-left w-[14%]">Description</div>
        <div className="text-left w-[14%]">Is Bond?</div>
        <div className="text-left w-[14%]">Status</div>
        <div className="text-left w-[14%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {expenseRequests.map((expenseRequest, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">{expenseRequest.activity}</div>
            <div className="text-left w-[9%] pl-2">
              {new Date(expenseRequest.date).toLocaleDateString()}
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(expenseRequest.amount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {expenseRequest.description}
            </div>
            <div className="text-left w-[14%] pl-2">
              {expenseRequest.isBond ? "Yes" : "No"}
              <p>
                {expenseRequest.isBond
                  ? `Start: ${new Date(
                      expenseRequest.bondStartDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
              <p>
                {expenseRequest.isBond
                  ? `End: ${new Date(
                      expenseRequest.bondEndDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
            </div>

            {canApproveExpenseRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {expenseRequest.status === "APPROVED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {expenseRequest.status}
                  </span>
                ) : expenseRequest.status === "REJECTED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-red-400  text-white">
                    {expenseRequest.status}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {expenseRequest.status}
                  </span>
                )}
              </div>
            ) : null}
            {canApproveExpenseRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {expenseRequest.status === "PENDING" && (
                  <>
                    <button
                      className="bg-indigo-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-indigo-600"
                      onClick={() => approveExpenseRequest(expenseRequest.id)}
                      disabled={
                        approvingExpenseRequest === expenseRequest.id ||
                        rejectingExpenseRequest === expenseRequest.id
                      }
                    >
                      {approvingExpenseRequest === expenseRequest.id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      onClick={() => rejectExpenseRequest(expenseRequest.id)}
                      disabled={
                        approvingExpenseRequest === expenseRequest.id ||
                        rejectingExpenseRequest === expenseRequest.id
                      }
                    >
                      {rejectingExpenseRequest === expenseRequest.id
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpenseRequestsTable;
