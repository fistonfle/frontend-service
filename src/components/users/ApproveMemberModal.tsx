/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type RequestLetter = {
  createdAt: string;
  id: string;
  name: string;
  publicId: string;
  secureUrl: string;
  type: string;
  updatedAt: string;
};

type Props = {
  onSuccessfulSubmit: () => void;
  userId: string;
  requestLetter?: RequestLetter;
  memberID?: string;
};

const ApproveMemberModal = ({ onSuccessfulSubmit, userId }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AppContext);
  const canApprove = ["PRESIDENT", "VICE_PRESIDENT"].includes(
    user?.info?.role || ""
  );

  const { handleLogout } = React.useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirm("Are you sure you want to approve this user?") === false)
      return;
    if (submitting) return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.put(
        url + `/users/approve/${userId}`
      );
      if (response.data) {
        toast.success("User successfully approved");
        onSuccessfulSubmit();
      }
    } catch (error: any) {
      handleApiError(error, handleLogout);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {canApprove ? (
        <div className="flex justify-start mt-5">
          <button
            className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Approving..." : "Approve"}
          </button>
        </div>
      ) : (
        <div className="flex justify-start mt-5">
          <button
            className="bg-indigo-500 text-red-500 px-5 py-2 rounded-md hover:bg-indigo-600"
            type="submit"
            disabled={true}
          >
            Not approved
          </button>
        </div>
      )}
    </form>
  );
};

export default ApproveMemberModal;
