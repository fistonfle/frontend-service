/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import ReturnMoneyButton from "./ReturnMoneyButton";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type ExitRequest = {
  id: string;
  createdAt: string;
  exitRequestType: any;
  status: string;
  completedStatus: string;
  user: any;
};
type ExitRequestsTableProps = {
  exitRequests: ExitRequest[];
  reloadExitRequests: () => void;
  canApproveExitRequests: boolean;
  canCompleteExitRequests: boolean;
};

const ExitRequestsTable: React.FC<ExitRequestsTableProps> = ({
  exitRequests,
  reloadExitRequests,
  canApproveExitRequests,
  canCompleteExitRequests,
}) => {
  const [approvingExitRequest, setApprovingExitRequest] = React.useState<
    string | null
  >(null);
  const [rejectingExitRequest, setRejectingExitRequest] = React.useState<
    string | null
  >(null);
  const [completingExitRequest, setCompletingExitRequest] = React.useState<
    string | null
  >(null);
  const { handleLogout } = React.useContext(AppContext);

  const approveExitRequest = async (requestIdToApprove: string) => {
    if (!confirm("Are you sure you want to approve this exit request?")) {
      return;
    }
    try {
      setApprovingExitRequest(requestIdToApprove);
      setRejectingExitRequest(null);
      const response = await axiosInstance.put(
        url + `/exit-requests/${requestIdToApprove}/approve`
      );
      console.log(response.data);
      toast.success("Exit created successfully");
      setApprovingExitRequest(null);
      reloadExitRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setApprovingExitRequest(null);
    }
  };

  const rejectExitRequest = async (requestIdToReject: string) => {
    if (!confirm("Are you sure you want to reject this exit request?")) {
      return;
    }
    try {
      setRejectingExitRequest(requestIdToReject);
      setApprovingExitRequest(null);
      const response = await axiosInstance.put(
        url + `/exit-requests/${requestIdToReject}/reject`
      );
      console.log(response.data);
      toast.success("Exit request rejected successfully");
      setRejectingExitRequest(null);
      reloadExitRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setRejectingExitRequest(null);
    }
  };

  const completeExitRequest = async (requestIdToComplete: string) => {
    if (!confirm("Are you sure you want to complete this exit request?")) {
      return;
    }
    try {
      setCompletingExitRequest(requestIdToComplete);
      const response = await axiosInstance.put(
        url + `/exit-requests/${requestIdToComplete}/complete`
      );
      console.log(response.data);
      toast.success("Exit request completed successfully");
      setCompletingExitRequest(null);
      reloadExitRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setCompletingExitRequest(null);
    }
  };

  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[14%]">Names</div>
        <div className="text-left w-[14%]">Exit Type</div>
        <div className="text-left w-[14%]">Date</div>
        {canApproveExitRequests ? (
          <div className="text-left w-[14%]">Approval Status</div>
        ) : canCompleteExitRequests ? (
          <div className="text-left w-[14%]">Completion Status</div>
        ) : null}
        <div className="text-left w-[14%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {exitRequests.map((exitRequest, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">
              {exitRequest.user?.firstname} {exitRequest.user?.lastname}
            </div>
            <div className="text-left w-[14%] pl-2">
              {exitRequest.exitRequestType?.replace("_", " ")}
            </div>
            <div className="text-left w-[14%] pl-2">
              {new Date(exitRequest.createdAt).toLocaleDateString()}
            </div>

            {canApproveExitRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {exitRequest.status === "APPROVED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {exitRequest.status}
                  </span>
                ) : exitRequest.status === "REJECTED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-red-400  text-white">
                    {exitRequest.status}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {exitRequest.status}
                  </span>
                )}
              </div>
            ) : canCompleteExitRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {exitRequest.completedStatus === "COMPLETED" ? (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                    {exitRequest.completedStatus}
                  </span>
                ) : (
                  <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                    {exitRequest.completedStatus}
                  </span>
                )}
              </div>
            ) : null}
            {canApproveExitRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {exitRequest.status === "PENDING" && (
                  <>
                    <button
                      className="bg-indigo-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-indigo-600"
                      onClick={() => approveExitRequest(exitRequest.id)}
                      disabled={
                        approvingExitRequest === exitRequest.id ||
                        rejectingExitRequest === exitRequest.id
                      }
                    >
                      {approvingExitRequest === exitRequest.id
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      onClick={() => rejectExitRequest(exitRequest.id)}
                      disabled={
                        approvingExitRequest === exitRequest.id ||
                        rejectingExitRequest === exitRequest.id
                      }
                    >
                      {rejectingExitRequest === exitRequest.id
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                )}
              </div>
            ) : canCompleteExitRequests ? (
              <div className="text-left w-[14%] pl-2 flex items-center">
                {/* approve and reject buttons */}
                {exitRequest.completedStatus === "PENDING" && (
                  <div>
                    {exitRequest.exitRequestType === "PERMANENT" && (
                      <ReturnMoneyButton userId={exitRequest.user?.id || ""} />
                    )}
                    <button
                      className="bg-green-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-green-600"
                      onClick={() => completeExitRequest(exitRequest.id)}
                      disabled={completingExitRequest === exitRequest.id}
                    >
                      {completingExitRequest === exitRequest.id
                        ? "Completing..."
                        : "Complete"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExitRequestsTable;
