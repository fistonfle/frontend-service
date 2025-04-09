/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type WithdrawalRequest = {
  id: string;
  amount: number;
  status: string;
  completedStatus: string;
  user: any;
  createdAt: string;
  isRelatedToPartialExit: boolean;
};
type WithdrawalRequestsTableProps = {
  withdrawalRequests: WithdrawalRequest[];
  reloadWithdrawalRequests: () => void;
  canApproveWithdrawalRequests: boolean;
  canCompleteWithdrawalRequests: boolean;
};

const WithdrawalRequestsTable: React.FC<WithdrawalRequestsTableProps> = ({
  withdrawalRequests,
  reloadWithdrawalRequests,
  canApproveWithdrawalRequests,
  canCompleteWithdrawalRequests,
}) => {
  const [approvingWithdrawalRequest, setApprovingWithdrawalRequest] =
    React.useState<string | null>(null);
  const [rejectingWithdrawalRequest, setRejectingWithdrawalRequest] =
    React.useState<string | null>(null);
  const [completingWithdrawalRequest, setCompletingWithdrawalRequest] =
    React.useState<string | null>(null);

  const { handleLogout } = React.useContext(AppContext);

  const approveWithdrawalRequest = async (requestIdToApprove: string) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }
    try {
      setApprovingWithdrawalRequest(requestIdToApprove);
      setRejectingWithdrawalRequest(null);
      const response = await axiosInstance.put(
        url + `/withdrawal-requests/${requestIdToApprove}/approve`
      );
      console.log(response.data);
      toast.success("Withdrawal request approved successfully");
      setApprovingWithdrawalRequest(null);
      reloadWithdrawalRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setApprovingWithdrawalRequest(null);
    }
  };

  const rejectWithdrawalRequest = async (requestIdToReject: string) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }
    try {
      setRejectingWithdrawalRequest(requestIdToReject);
      setApprovingWithdrawalRequest(null);
      const response = await axiosInstance.put(
        url + `/withdrawal-requests/${requestIdToReject}/reject`
      );
      console.log(response.data);
      toast.success("Withdrawal request rejected successfully");
      setRejectingWithdrawalRequest(null);
      reloadWithdrawalRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setRejectingWithdrawalRequest(null);
    }
  };

  const completeWithdrawalRequest = async (requestIdToComplete: string) => {
    if (!window.confirm("Are you sure you want to complete this request?")) {
      return;
    }
    try {
      setCompletingWithdrawalRequest(requestIdToComplete);
      const response = await axiosInstance.put(
        url + `/withdrawal-requests/${requestIdToComplete}/complete`
      );
      console.log(response.data);
      toast.success("Withdrawal request completed successfully");
      setCompletingWithdrawalRequest(null);
      reloadWithdrawalRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setCompletingWithdrawalRequest(null);
    }
  };
  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[14%]">Names</div>
        <div className="text-left w-[14%]">Requested Amount</div>
        <div className="text-left w-[14%]">Date</div>
        <div className="text-left w-[14%]">Related to Partial Exit</div>
        {canApproveWithdrawalRequests ? (
          <div className="text-left w-[14%]">Approval Status</div>
        ) : canCompleteWithdrawalRequests ? (
          <div className="text-left w-[14%]">Completion Status</div>
        ) : null}
        <div className="text-left w-[14%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {withdrawalRequests.map((withdrawal, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">
              {withdrawal.user?.firstname} {withdrawal.user?.lastname}
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(withdrawal.amount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {new Date(withdrawal.createdAt).toLocaleDateString()}
            </div>
            <div className="text-left w-[14%]">
              {withdrawal.isRelatedToPartialExit ? "Yes" : "No"}
            </div>

            {canApproveWithdrawalRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {withdrawal.status === "APPROVED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {withdrawal.status}
                  </span>
                ) : withdrawal.status === "REJECTED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-red-400  text-white">
                    {withdrawal.status}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {withdrawal.status}
                  </span>
                )}
              </div>
            ) : canCompleteWithdrawalRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {withdrawal.completedStatus === "COMPLETED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {withdrawal.completedStatus}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {withdrawal.completedStatus}
                  </span>
                )}
              </div>
            ) : null}
            {canApproveWithdrawalRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {withdrawal.status === "PENDING" && (
                  <>
                    <button
                      className="bg-indigo-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-indigo-600"
                      onClick={() => approveWithdrawalRequest(withdrawal.id)}
                      disabled={
                        approvingWithdrawalRequest === withdrawal.id ||
                        rejectingWithdrawalRequest === withdrawal.id
                      }
                    >
                      {approvingWithdrawalRequest === withdrawal.id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      onClick={() => rejectWithdrawalRequest(withdrawal.id)}
                      disabled={
                        approvingWithdrawalRequest === withdrawal.id ||
                        rejectingWithdrawalRequest === withdrawal.id
                      }
                    >
                      {rejectingWithdrawalRequest === withdrawal.id
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                )}
             {/*  added rejecting approved loans */}
                {/* {withdrawal.status === "APPROVED" &&
                  withdrawal.completedStatus === "PENDING" && (
                    <>
                      <button
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        onClick={() => rejectWithdrawalRequest(withdrawal.id)}
                        disabled={
                          approvingWithdrawalRequest === withdrawal.id ||
                          rejectingWithdrawalRequest === withdrawal.id
                        }
                      >
                        {rejectingWithdrawalRequest === withdrawal.id
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </>
                  )} */}
              </div>
            ) : canCompleteWithdrawalRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {withdrawal.completedStatus === "PENDING" && (
                  <button
                    className="bg-green-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-green-600"
                    onClick={() => completeWithdrawalRequest(withdrawal.id)}
                    disabled={completingWithdrawalRequest === withdrawal.id}
                  >
                    {completingWithdrawalRequest === withdrawal.id
                      ? "Completing..."
                      : "Complete"}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WithdrawalRequestsTable;
