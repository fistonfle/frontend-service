/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type ProfileEditRequest = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  memberID: string;
  share: string;
  user: any;
  status: string;
};
type ProfileEditRequestsTableProps = {
  profileEditRequests: ProfileEditRequest[];
  reloadProfileEditRequests: () => void;
};

const ProfileEditRequestsTable: React.FC<ProfileEditRequestsTableProps> = ({
  profileEditRequests,
  reloadProfileEditRequests,
}) => {
  const [approvingProfileEditRequest, setapprovingProfileEditRequest] =
    React.useState<string | null>(null);
  const [rejectingProfileEditRequest, setRejectingProfileEditRequest] =
    React.useState<string | null>(null);

  const { handleLogout } = React.useContext(AppContext);

  const approveProfileEditRequest = async (requestIdToApprove: string) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }
    try {
      setapprovingProfileEditRequest(requestIdToApprove);
      setRejectingProfileEditRequest(null);
      const response = await axiosInstance.put(
        url + `/profile-edit-requests/${requestIdToApprove}/approve`
      );
      console.log(response.data);
      toast.success("Profile Edit request approved successfully");
      setapprovingProfileEditRequest(null);
      reloadProfileEditRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setapprovingProfileEditRequest(null);
    }
  };

  const rejectProfileEditRequest = async (requestIdToReject: string) => {
    try {
      setRejectingProfileEditRequest(requestIdToReject);
      setapprovingProfileEditRequest(null);
      const response = await axiosInstance.put(
        url + `/profile-edit-requests/${requestIdToReject}/reject`
      );
      console.log(response.data);
      toast.success("Profile Edit request rejected successfully");
      setRejectingProfileEditRequest(null);
      reloadProfileEditRequests();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setRejectingProfileEditRequest(null);
    }
  };
  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[14%]">Names</div>
        <div className="text-left w-[14%]">Email</div>
        <div className="text-left w-[14%]">Phone Number</div>
        <div className="text-left w-[9%]">Member ID</div>
        <div className="text-left w-[14%]">Monthly Contribution</div>
        <div className="text-left w-[14%]">Status</div>
        <div className="text-left w-[14%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {profileEditRequests.map((profileEditRequest, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">
              {profileEditRequest.user?.firstname}{" "}
              {profileEditRequest.user?.lastname}
            </div>
            <div className="text-left w-[14%]">{profileEditRequest.email}</div>
            <div className="text-left w-[14%]">
              {profileEditRequest.phoneNumber}
            </div>
            <div className="text-left w-[9%]">
              {profileEditRequest.memberID}
            </div>
            <div className="text-left w-[14%]">
              {formatCurrency(profileEditRequest.share)}
            </div>

            <div className="text-left w-[14%] pl-2 flex items-center">
              {profileEditRequest.status === "APPROVED" ? (
                <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                  {profileEditRequest.status}
                </span>
              ) : profileEditRequest.status === "REJECTED" ? (
                <span className="px-2 text-[12px] py-[2px] rounded-lg bg-red-400  text-white">
                  {profileEditRequest.status}
                </span>
              ) : (
                <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                  {profileEditRequest.status}
                </span>
              )}
            </div>
            <div className="text-left w-[14%] pl-2 flex items-center">
              {/* approve and reject buttons */}
              {profileEditRequest.status === "PENDING" && (
                <>
                  <button
                    className="bg-indigo-500 text-white px-3 py-2 mr-2 rounded-md hover:bg-indigo-600"
                    onClick={() =>
                      approveProfileEditRequest(profileEditRequest.id)
                    }
                    disabled={
                      approvingProfileEditRequest === profileEditRequest.id ||
                      rejectingProfileEditRequest === profileEditRequest.id
                    }
                  >
                    {approvingProfileEditRequest === profileEditRequest.id
                      ? "Approving..."
                      : "Approve"}
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    onClick={() =>
                      rejectProfileEditRequest(profileEditRequest.id)
                    }
                    disabled={
                      approvingProfileEditRequest === profileEditRequest.id ||
                      rejectingProfileEditRequest === profileEditRequest.id
                    }
                  >
                    {rejectingProfileEditRequest === profileEditRequest.id
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileEditRequestsTable;
