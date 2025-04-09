/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

const USER_ROLE = "User Role";
const CHANGING_TEXT = "Changing...";

type Props = {
  onSuccessfulSubmit: () => void;
  user: any;
};

const ChangeUserRole = ({ onSuccessfulSubmit, user }: Props) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleLogout } = React.useContext(AppContext);

  const handleChangeUserRole = async (newRole: string) => {
    if (submitting) return;

    const confirmationMessage = `Are you sure you want to change ${user.firstname} ${user.lastname}'s role to ${newRole}?`;

    if (!window.confirm(confirmationMessage)) return;

    try {
      setSubmitting(true);
      const response = await axiosInstance.put(
        `${url}/users/change-user-role/${user.id}?role=${newRole}`
      );
      if (response.data) {
        toast.success("User role successfully changed");
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

  const roles = ["STANDARD", "MANAGER", "PRESIDENT", "VICE_PRESIDENT"];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-600 mb-3">{USER_ROLE}</h3>
      <div className="flex flex-row items-center">
        <p className="text-sm font-semibold text-gray-600">{user.role}</p>
        {roles
          .filter((role) => role !== user.role)
          .map((role) => (
            <button
              key={role}
              className="bg-indigo-500 text-white ml-4 px-3 py-1 text-sm rounded-md hover:bg-indigo-600"
              onClick={() => handleChangeUserRole(role)}
            >
              {submitting ? CHANGING_TEXT : `Change to ${role}`}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ChangeUserRole;
