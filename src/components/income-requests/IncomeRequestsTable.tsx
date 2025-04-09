/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/functions";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type IncomeRequest = {
  id: string;
  date: string;
  activity: string;
  amount: number;
  bankCharges: number;
  description: string;
  status: string;
  isBond: boolean;
  bondStartDate: string;
  bondEndDate: string;
};
type IncomeRequestsTableProps = {
  incomeRequests: IncomeRequest[];
  reloadIncomeRequests: () => void;
  canApproveIncomeRequests: boolean;
};

const IncomeRequestsTable: React.FC<IncomeRequestsTableProps> = ({
  incomeRequests,
  reloadIncomeRequests,
  canApproveIncomeRequests,
}) => {
  const [approvingIncomeRequest, setApprovingIncomeRequest] = React.useState<
    string | null
  >(null);
  const [rejectingIncomeRequest, setRejectingIncomeRequest] = React.useState<
    string | null
  >(null);
  const { handleLogout } = React.useContext(AppContext);

  const approveIncomeRequest = async (requestIdToApprove: string) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }
    try {
      setApprovingIncomeRequest(requestIdToApprove);
      setRejectingIncomeRequest(null);
      const response = await axiosInstance.put(
        url + `/income-activities-requests/${requestIdToApprove}/approve`
      );
      console.log(response.data);
      toast.success("Income Saving Request approved successfully");
      setApprovingIncomeRequest(null);
      reloadIncomeRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setApprovingIncomeRequest(null);
    }
  };

  const rejectIncomeRequest = async (requestIdToReject: string) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }
    try {
      setRejectingIncomeRequest(requestIdToReject);
      setApprovingIncomeRequest(null);
      const response = await axiosInstance.put(
        url + `/income-activities-requests/${requestIdToReject}/reject`
      );
      console.log(response.data);
      toast.success("Income Saving request rejected successfully");
      setRejectingIncomeRequest(null);
      reloadIncomeRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setRejectingIncomeRequest(null);
    }
  };

  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[14%]">Activity</div>
        <div className="text-left w-[9%]">Date</div>
        <div className="text-left w-[14%]">Amount</div>
        <div className="text-left w-[14%]">Bank Charges</div>
        {/* <div className="text-left w-[14%]">Description</div> */}
        <div className="text-left w-[14%]">Is Bond?</div>
        <div className="text-left w-[14%]">Status</div>
        <div className="text-left w-[14%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {incomeRequests.map((incomeRequest, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">{incomeRequest.activity}</div>
            <div className="text-left w-[9%] pl-2">
              {new Date(incomeRequest.date).toLocaleDateString()}
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(incomeRequest.amount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(incomeRequest.bankCharges || 0)} RWF
            </div>
            {/* <div className="text-left w-[14%] pl-2">
              {incomeRequest.description}
            </div> */}
            <div className="text-left w-[14%] pl-2">
              {incomeRequest.isBond ? "Yes" : "No"}
              <p>
                {incomeRequest.isBond
                  ? `Start: ${new Date(
                      incomeRequest.bondStartDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
              <p>
                {incomeRequest.isBond
                  ? `End: ${new Date(
                      incomeRequest.bondEndDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
            </div>

            {canApproveIncomeRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {incomeRequest.status === "APPROVED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {incomeRequest.status}
                  </span>
                ) : incomeRequest.status === "REJECTED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-red-400  text-white">
                    {incomeRequest.status}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {incomeRequest.status}
                  </span>
                )}
              </div>
            ) : null}
            {canApproveIncomeRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {incomeRequest.status === "PENDING" && (
                  <>
                    <button
                      className="bg-indigo-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-indigo-600"
                      onClick={() => approveIncomeRequest(incomeRequest.id)}
                      disabled={
                        approvingIncomeRequest === incomeRequest.id ||
                        rejectingIncomeRequest === incomeRequest.id
                      }
                    >
                      {approvingIncomeRequest === incomeRequest.id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      onClick={() => rejectIncomeRequest(incomeRequest.id)}
                      disabled={
                        approvingIncomeRequest === incomeRequest.id ||
                        rejectingIncomeRequest === incomeRequest.id
                      }
                    >
                      {rejectingIncomeRequest === incomeRequest.id
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

export default IncomeRequestsTable;
