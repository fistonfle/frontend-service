/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import UsersTable from "../components/users/UsersTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import RegisterExistingUserModal from "../components/users/RegisterExistingUserModal";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    maxHeight: "80vh", // Reduced max height for better control
    border: "1px solid #e0e0e0", // Subtle border color for a lighter look
    borderRadius: "8px",
    backgroundColor: "#f9fafb", // Light background for the modal
    padding: "20px", // Added some padding to make content less cramped
  },
};

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const { handleLogout, user } = useContext(AppContext);

  const isPresident =
    user?.info?.role === "PRESIDENT" || user?.info?.role === "VICE_PRESIDENT";
  const isManager = user?.info?.role === "MANAGER";

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/users");
        setUsers(response.data?.data || []);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <MainLayout
      title="Members"
      newButtonTitle="Add Member"
      onNewButtonClick={openModal}
      hideNewButton={!isManager && !isPresident}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Add Member</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <RegisterExistingUserModal
          onSuccessfulSubmit={() => {
            closeModal();
            setReload(!reload);
          }}
          isPresident={isPresident}
        />
      </Modal>
      <UsersTable
        users={users}
        reloadUsers={() => setReload(!reload)}
        isManager={isManager}
        isPresident={isPresident}
      />
    </MainLayout>
  );
};

export default UsersPage;
