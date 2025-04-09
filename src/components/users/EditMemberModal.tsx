/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import Input from "../reusable/Input";
import MemberStatusInfo from "./MemberStatusInfo";
import ChangeUserRole from "./ChangeUserRole";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  share: string;
  status: string;
  role: string;
  memberID: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ownerName: string;
  };
  hasLeft: boolean;
  hasStoppedContributing: boolean;
};

type Props = {
  onSuccessfulSubmit: () => void;
  user: Partial<User>;
  isPresident?: boolean;
};

const EditMemberModal = ({ onSuccessfulSubmit, user }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber ? user.phoneNumber : "0780000000",
    share: user.share,
    memberID: user.memberID,
    bankDetails: {
      bankName: user.bankDetails?.bankName || "",
      accountNumber: user.bankDetails?.accountNumber || "",
      ownerName: user.bankDetails?.ownerName || "",
    },
  });

  const { handleLogout } = React.useContext(AppContext);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.post(
        url + `/profile-edit-requests/edit/${user.id}`,
        fields
      );
      if (response.data) {
        toast.success("User account update sent");
        onSuccessfulSubmit();
      }
    } catch (error: any) {
      handleApiError(error, ()=>{
        console.log(error)
      });
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (submitting) return;
    if (
      !confirm(
        `Are you sure you want ${user.firstname} ${user.lastname} to leave the group?`
      )
    )
      return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.put(
        url + `/users/deactivate/${user.id}`
      );
      if (response.data) {
        toast.success("User successfully deactivated");
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

  const handleReActivate = async () => {
    if (submitting) return;
    if (
      !confirm(
        `Are you sure you want to re-activate ${user.firstname} ${user.lastname}?`
      )
    )
      return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.put(
        url + `/users/re-activate/${user.id}`
      );
      if (response.data) {
        toast.success("User successfully activated");
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

  const handleStopContributions = async () => {
    if (submitting) return;
    if (
      !confirm(
        `Are you sure you want to stop contributions for ${user.firstname} ${user.lastname}?`
      )
    )
      return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.put(
        url + `/users/stop-contributing/${user.id}`
      );
      if (response.data) {
        toast.success("User successfully stopped contributions");
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

  const handleResumeContributions = async () => {
    if (submitting) return;
    if (
      !confirm(
        `Are you sure you want to resume contributions for ${user.firstname} ${user.lastname}?`
      )
    )
      return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.put(
        url + `/users/resume-contributing/${user.id}`
      );
      if (response.data) {
        toast.success("User successfully resumed contributions");
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
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-3">
          <Input
            type="number"
            name="share"
            value={fields.share || ""}
            onInputChange={onInputChange}
            label="Member Contribution"
          />
          <Input
            type="text"
            name="memberID"
            value={fields.memberID || ""}
            onInputChange={onInputChange}
            label="Staff ID"
          />
          <div className="flex flex-col space-y-3">
            <label
              htmlFor="bankName"
              className="text-sm font-semibold text-gray-600"
            >
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              id="bankName"
              value={fields.bankDetails?.bankName}
              onChange={(e) =>
                setFields((prevFields) => ({
                  ...prevFields,
                  bankDetails: {
                    ...prevFields.bankDetails,
                    bankName: e.target.value,
                  },
                }))
              }
              className="border border-gray-300 rounded-md px-5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label
              htmlFor="accountNumber"
              className="text-sm font-semibold text-gray-600"
            >
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              value={fields.bankDetails?.accountNumber}
              onChange={(e) =>
                setFields((prevFields) => ({
                  ...prevFields,
                  bankDetails: {
                    ...prevFields.bankDetails,
                    accountNumber: e.target.value,
                  },
                }))
              }
              className="border border-gray-300 rounded-md px-5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <label
              htmlFor="ownerName"
              className="text-sm font-semibold text-gray-600"
            >
              Account Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              id="ownerName"
              value={fields.bankDetails?.ownerName}
              onChange={(e) =>
                setFields((prevFields) => ({
                  ...prevFields,
                  bankDetails: {
                    ...prevFields.bankDetails,
                    ownerName: e.target.value,
                  },
                }))
              }
              className="border border-gray-300 rounded-md px-5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          {/* phone number */}
          <Input
            type="text"
            name="phoneNumber"
            value={fields.phoneNumber || ""}
            onInputChange={onInputChange}
            label="Phone Number"
          />
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      <div className="h-px bg-gray-200 my-5"></div>
      {/* {isPresident && ( */}
      <>
        <ChangeUserRole onSuccessfulSubmit={onSuccessfulSubmit} user={user} />
        <div className="h-px bg-gray-200 my-5"></div>
      </>
      {/* )} */}
      <MemberStatusInfo
        hasStoppedContributing={user.hasStoppedContributing || false}
        memberHasLeft={user.hasLeft || false}
        onDeactivate={handleDeactivate}
        onReactivate={handleReActivate}
        onStopContributing={handleStopContributions}
        onResumeContributing={handleResumeContributions}
        userId={user.id || ""}
      />
    </>
  );
};

export default EditMemberModal;
