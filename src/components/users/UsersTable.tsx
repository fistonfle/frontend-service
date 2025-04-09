/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FaEdit } from "react-icons/fa";
import Modal from "react-modal";
import ApproveMemberModal from "./ApproveMemberModal";
import EditMemberModal from "./EditMemberModal";
import MemberInformationReport from "../reportsGenerator/MemberInformationReport";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { formatCurrency } from "../../utils/functions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    maxHeight: "99vh",
    borderRadius: "8px",
    backgroundColor: "#f9fafb", // Light background color
    border: "1px solid #e0e0e0", // Light border color
    padding: "20px",
  },
};

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
  requestLetter?: any;
};

type UsersTableProps = {
  users: User[];
  reloadUsers: () => void;
  isManager?: boolean;
  isPresident?: boolean;
};

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  reloadUsers,
  isManager = false,
  isPresident = false,
}) => {
  const [selectedUserUser, setSelectedUser] = React.useState<Partial<User>>({});
  const [isApproveModalOpen, setIsApprovedModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const closeModal = () => {
    setIsApprovedModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedUser({});
  };

  const isUserMatchSearch = (user: User) => {
    const searchValue = search.toLowerCase();
    return (
      user.firstname?.toLowerCase().includes(searchValue) ||
      user.lastname?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.phoneNumber?.toLowerCase().includes(searchValue) ||
      user.memberID?.toLowerCase().includes(searchValue)
    );
  };

  const filteredUsers = users.filter(isUserMatchSearch);

  return (
    <section>
      <Modal
        isOpen={isApproveModalOpen || isEditModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">
            {isApproveModalOpen ? "Approve" : "Edit"}{" "}
            {selectedUserUser.firstname} {selectedUserUser.lastname}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        {isApproveModalOpen ? (
          <ApproveMemberModal
            userId={selectedUserUser.id ?? ""}
            onSuccessfulSubmit={() => {
              closeModal();
              reloadUsers();
            }}
            requestLetter={selectedUserUser.requestLetter}
            memberID={selectedUserUser.memberID || ""}
          />
        ) : (
          <EditMemberModal
            user={selectedUserUser}
            onSuccessfulSubmit={() => {
              closeModal();
              reloadUsers();
            }}
            isPresident={isPresident}
          />
        )}
      </Modal>

      {/* Search Input */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name, email, phone number, member ID"
            className="border border-gray-300 p-2 rounded-md w-80 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="invoice-table-row invoice-table-header bg-white mt-8 rounded-xl px-8 py-3 flex items-center justify-between text-xs font-medium text-gray-600">
        <div className="text-left w-[15%]">Names</div>
        <div className="text-left w-[25%]">Email</div>
        <div className="text-left w-[15%]">Contribution</div>
        <div className="text-left w-[15%]">Status</div>
        <div className="text-left w-[15%]">Role</div>
        <div className="text-left w-[15%]">Staff ID</div>
        <div className="text-center w-[10%]">Actions</div>
      </div>

      {/* Table Rows */}
      <div className="bg-white mt-4 rounded-xl text-xs text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className={`invoice-table-row flex items-center justify-between px-8 py-3 ${
              user.hasLeft ? "text-red-500" : ""
            }`}
          >
            <div className="text-left w-[15%]">
              {user.firstname} {user.lastname}
            </div>
            <div className="text-left w-[25%] pl-2">{user.email}</div>
            <div
              className={`text-left w-[15%] pl-2 ${
                user.hasStoppedContributing ? "text-red-500" : ""
              }`}
            >
              {formatCurrency(user.share || 0)} RWF
            </div>
            <div
              className={`text-left w-[15%] pl-2 ${
                user.status === "EXITED" ? " text-red-500" : ""
              }`}
            >
              {user.status}
            </div>
            <div className="text-left w-[15%] pl-2">{user.role}</div>
            <div className="text-left w-[15%] pl-2">{user.memberID}</div>
            <div className="text-center w-[10%] flex items-center justify-center">
              {user.status === "PENDING" ||
              user.status === "REJECTED" ||
              user.status === "EXITED" ? (
                isPresident ? (
                  <button
                    className="text-green-600 hover:text-green-900 text-xs"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(false);
                      setIsApprovedModalOpen(true);
                    }}
                  >
                    Approve
                  </button>
                ) : (
                  <div className="text-red-600 text-xs">Pending approval</div>
                )
              ) : (
                <div className="flex items-center justify-center">
                  {(isManager || isPresident) && (
                    <>
                      <ReactTooltip place="top" anchorSelect=".edit-icon">
                        <span>Edit Member</span>
                      </ReactTooltip>
                      <FaEdit
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer edit-icon text-sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsApprovedModalOpen(false);
                          setIsEditModalOpen(true);
                        }}
                      />
                    </>
                  )}
                  <MemberInformationReport userId={user.id} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsersTable;
