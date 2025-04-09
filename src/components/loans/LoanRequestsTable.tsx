/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/functions";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type LoanRequest = {
  id: string;
  date: string;
  startPaymentDate: string;
  loanType: any;
  amount: number;
  status: string;
  completedStatus: string;
  user: any;
  customPaymentMonths: number;
};
type LoanRequestsTableProps = {
  loanRequests: LoanRequest[];
  reloadLoanRequests: () => void;
  canApproveLoanRequests: boolean;
  canCompleteLoanRequests: boolean;
};

const LoanRequestsTable: React.FC<LoanRequestsTableProps> = ({
  loanRequests,
  reloadLoanRequests,
  canApproveLoanRequests,
  canCompleteLoanRequests,
}) => {
  const [approvingLoanRequest, setApprovingLoanRequest] = React.useState<
    string | null
  >(null);
  const [rejectingLoanRequest, setRejectingLoanRequest] = React.useState<
    string | null
  >(null);
  const [completingLoanRequest, setCompletingLoanRequest] = React.useState<
    string | null
  >(null);
  const { handleLogout } = React.useContext(AppContext);

  const approveLoanRequest = async (requestIdToApprove: string) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }
    try {
      setApprovingLoanRequest(requestIdToApprove);
      setRejectingLoanRequest(null);
      const response = await axiosInstance.put(
        url + `/loan-requests/${requestIdToApprove}/approve`
      );
      console.log(response.data);
      toast.success("Loan created successfully");
      setApprovingLoanRequest(null);
      reloadLoanRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setApprovingLoanRequest(null);
    }
  };

  const rejectLoanRequest = async (requestIdToReject: string) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }
    try {
      setRejectingLoanRequest(requestIdToReject);
      setApprovingLoanRequest(null);
      const response = await axiosInstance.put(
        url + `/loan-requests/${requestIdToReject}/reject`
      );
      console.log(response.data);
      toast.success("Loan request rejected successfully");
      setRejectingLoanRequest(null);
      reloadLoanRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setRejectingLoanRequest(null);
    }
  };

  const completeLoanRequest = async (requestIdToComplete: string) => {
    if (!window.confirm("Are you sure you want to complete this request?")) {
      return;
    }
    try {
      setCompletingLoanRequest(requestIdToComplete);
      const response = await axiosInstance.put(
        url + `/loan-requests/${requestIdToComplete}/complete`
      );
      console.log(response.data);
      toast.success("Loan request completed successfully");
      setCompletingLoanRequest(null);
      reloadLoanRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setCompletingLoanRequest(null);
    }
  };

  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[14%]">Names</div>
        <div className="text-left w-[9%]">Loan Type</div>
        <div className="text-left w-[14%]">Requested Amount</div>
        <div className="text-left w-[14%]">Start Payment Date</div>
        <div className="text-left w-[14%]">Payment Months</div>
        {canApproveLoanRequests ? (
          <div className="text-left w-[14%]">Approval Status</div>
        ) : canCompleteLoanRequests ? (
          <div className="text-left w-[14%]">Completion Status</div>
        ) : null}
        <div className="text-left w-[14%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {loanRequests.map((loanRequest, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">
              {loanRequest.user?.firstname} {loanRequest.user?.lastname}
            </div>
            <div className="text-left w-[9%] pl-2">
              {loanRequest.loanType?.name ||
                loanRequest.loanType?.paymentMonths + " months"}
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(loanRequest.amount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {new Date(loanRequest.startPaymentDate).toLocaleDateString()}
            </div>
            <div className="text-left w-[14%] pl-2">
              {(loanRequest.customPaymentMonths > 0
                ? loanRequest.customPaymentMonths
                : loanRequest.loanType?.paymentMonths) || "N/A"}
            </div>

            {canApproveLoanRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {loanRequest.status === "APPROVED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {loanRequest.status}
                  </span>
                ) : loanRequest.status === "REJECTED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-red-400  text-white">
                    {loanRequest.status}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {loanRequest.status}
                  </span>
                )}
              </div>
            ) : canCompleteLoanRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {loanRequest.completedStatus === "COMPLETED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {loanRequest.completedStatus}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {loanRequest.completedStatus}
                  </span>
                )}
              </div>
            ) : null}
            {canApproveLoanRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {loanRequest.status === "PENDING" && (
                  <>
                    <button
                      className="bg-indigo-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-indigo-600"
                      onClick={() => approveLoanRequest(loanRequest.id)}
                      disabled={
                        approvingLoanRequest === loanRequest.id ||
                        rejectingLoanRequest === loanRequest.id
                      }
                    >
                      {approvingLoanRequest === loanRequest.id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      onClick={() => rejectLoanRequest(loanRequest.id)}
                      disabled={
                        approvingLoanRequest === loanRequest.id ||
                        rejectingLoanRequest === loanRequest.id
                      }
                    >
                      {rejectingLoanRequest === loanRequest.id
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                )}
                {/*  reject loan */}
                {/* {loanRequest.status === "APPROVED" &&
                  loanRequest.completedStatus === "PENDING" && (
                    <>
                      <button
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        onClick={() => rejectLoanRequest(loanRequest.id)}
                        disabled={
                          approvingLoanRequest === loanRequest.id ||
                          rejectingLoanRequest === loanRequest.id
                        }
                      >
                        {rejectingLoanRequest === loanRequest.id
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </>
                  )} */}
              </div>
            ) : canCompleteLoanRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {loanRequest.completedStatus === "PENDING" && (
                  <button
                    className="bg-green-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-green-600"
                    onClick={() => completeLoanRequest(loanRequest.id)}
                    disabled={completingLoanRequest === loanRequest.id}
                  >
                    {completingLoanRequest === loanRequest.id
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

export default LoanRequestsTable;
