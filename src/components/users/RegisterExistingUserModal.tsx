/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import Input from "../reusable/Input";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type Props = {
  onSuccessfulSubmit: () => void;
  isPresident?: boolean;
};

const RegisterExistingUserModal = ({
  onSuccessfulSubmit,
  isPresident = false,
}: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    role: "STANDARD",
    share: 0,
    memberID: "",
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ownerName: "",
    },
  });

  const { handleLogout } = React.useContext(AppContext);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axiosInstance.post(
        url + `/auth/register-as-existing`,
        fields
      );
      if (response.data) {
        toast.success("Member successfully registered and approved");
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
      {/* radio for role */}
      {isPresident && (
        <div className="flex flex-col space-y-3">
          <label htmlFor="role" className="text-sm font-semibold text-gray-600">
            Role
          </label>
          {/* radio buttons */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                id="role"
                value="STANDARD"
                checked={fields.role === "STANDARD"}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    role: e.target.value as any,
                  }))
                }
              />
              <label htmlFor="role">Standard</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                id="role"
                value="MANAGER"
                checked={fields.role === "MANAGER"}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    role: e.target.value as any,
                  }))
                }
              />
              <label htmlFor="role">Manager</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                id="role"
                value="VICE_PRESIDENT"
                checked={fields.role === "VICE_PRESIDENT"}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    role: e.target.value as any,
                  }))
                }
              />
              <label htmlFor="role">Vice President</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                id="role"
                value="PRESIDENT"
                checked={fields.role === "PRESIDENT"}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    role: e.target.value as any,
                  }))
                }
              />
              <label htmlFor="role">President</label>
            </div>
          </div>
        </div>
      )}
      <Input
        type="text"
        name="firstname"
        value={fields.firstname}
        onInputChange={onInputChange}
        label="Firstname"
      />
      <Input
        type="text"
        name="lastname"
        value={fields.lastname}
        onInputChange={onInputChange}
        label="Lastname"
      />
      <Input
        type="email"
        name="email"
        value={fields.email}
        onInputChange={onInputChange}
        label="Email"
      />
      <Input
        type="text"
        name="phoneNumber"
        value={fields.phoneNumber}
        onInputChange={onInputChange}
        label="Phone Number"
      />
      <Input
        type="number"
        name="share"
        value={fields.share}
        onInputChange={onInputChange}
        label="Member Contribution"
      />
      <Input
        type="text"
        name="memberID"
        value={fields.memberID}
        onInputChange={onInputChange}
        label="Staff ID"
      />{" "}
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
      <div className="flex justify-end mt-5">
        <button
          className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register And Approve"}
        </button>
      </div>
    </form>
  );
};

export default RegisterExistingUserModal;
