/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { AppContext } from "../context/AppContext";
import url from "../helpers/url";
import axiosInstance from "../helpers/axios";
import Input from "../components/reusable/Input";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";

const ProfilePage = () => {
  const { reloadUser, user } = useContext(AppContext);
  useEffect(() => {
    reloadUser?.();
    (async () => {})();
  }, []);

  const {
    lastname,
    firstname,
    email,
    bankDetails,
    memberID,
    phoneNumber,
    share,
  } = user?.info || {};

  const [edit, setEdit] = React.useState(false);

  const [editData, setEditData] = React.useState({
    firstname,
    lastname,
    email,
    phoneNumber,
    share,
    memberID,
    bankDetails,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigation = useNavigate();

  const { handleLogout } = React.useContext(AppContext);

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        url + "/profile-edit-requests",
        editData
      );
      if (response.status === 200) {
        toast.success("Profile edit request sent successfully");
        setEdit(false);
        navigation("/login");
      }
    } catch (error: any) {
      handleApiError(error, handleLogout);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout title="" hideFilters hideNewButton>
      <div className="container mx-auto my-4">
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="mt-5">
                  <p className="text-sm text-gray-600 mt-5">
                    <b>First Name:</b> {firstname}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Last Name:</b> {lastname}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Email:</b> {email}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Phone Number:</b> {phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Staff ID:</b> {memberID}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Monthly Contribution:</b> {share}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Bank Details</h2>
                <div className="mt-5">
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Bank Name:</b> {bankDetails?.bankName}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Account Name:</b> {bankDetails?.ownerName}
                  </p>
                  <p className="text-sm text-gray-600 mt-5">
                    <b>Account Number:</b> {bankDetails?.accountNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* handle profile edits requests */}
        <div className="mt-4">
          {!edit && (
            <button
              onClick={() => setEdit(!edit)}
              className="bg-indigo-500 text-white py-2 px-4 rounded-lg"
            >
              {"Edit Profile"}
            </button>
          )}
        </div>
        {/* edit profile form */}
        {edit && (
          <div className="bg-white p-4 shadow rounded-lg mt-4">
            <div className="mt-5 ">
              <Input
                label="First Name"
                name="firstname"
                value={editData.firstname}
                onInputChange={(e) =>
                  setEditData({ ...editData, firstname: e.target.value })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Last Name"
                name="lastname"
                value={editData.lastname}
                onInputChange={(e) =>
                  setEditData({ ...editData, lastname: e.target.value })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Email"
                name="email"
                value={editData.email}
                onInputChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                type={"email"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={editData.phoneNumber}
                onInputChange={(e) =>
                  setEditData({ ...editData, phoneNumber: e.target.value })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Staff ID"
                name="memberID"
                value={editData.memberID}
                onInputChange={(e) =>
                  setEditData({ ...editData, memberID: e.target.value })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Monthly Contribution"
                name="share"
                value={editData.share}
                onInputChange={(e) =>
                  setEditData({ ...editData, share: e.target.value })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Bank Name"
                name="bankName"
                value={editData.bankDetails?.bankName}
                onInputChange={(e) =>
                  setEditData({
                    ...editData,
                    bankDetails: {
                      ...editData.bankDetails,
                      bankName: e.target.value,
                    },
                  })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Account Name"
                name="ownerName"
                value={editData.bankDetails?.ownerName}
                onInputChange={(e) =>
                  setEditData({
                    ...editData,
                    bankDetails: {
                      ...editData.bankDetails,
                      ownerName: e.target.value,
                    },
                  })
                }
                type={"text"}
              />
            </div>
            <div className="mt-5">
              <Input
                label="Account Number"
                name="accountNumber"
                value={editData.bankDetails?.accountNumber}
                onInputChange={(e) =>
                  setEditData({
                    ...editData,
                    bankDetails: {
                      ...editData.bankDetails,
                      accountNumber: e.target.value,
                    },
                  })
                }
                type={"text"}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-indigo-500 text-white py-2 px-4 rounded-lg"
                onClick={handleEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Profile Edits"}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
