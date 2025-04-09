import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import { FaDownload } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { usePDF, Margin } from "react-to-pdf";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { formatCurrency } from "../../utils/functions";
import { handleApiError } from "../../utils/handleApiError";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
};

type MemberInformationReportProps = {
  userId: string;
  customButton?: React.ReactNode;
};

const MemberInformationReport: React.FC<MemberInformationReportProps> = ({
  userId,
  customButton,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [memberData, setMemberData] = useState<any>({});
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toPDF, targetRef } = usePDF({
    filename: "memberInformation.pdf",
    page: { margin: Margin.MEDIUM },
  });

  const { handleLogout } = useContext(AppContext);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const generatePDF = async () => {
    try {
      const response = await axiosInstance.get(
        `${url}/reports-maker/user/${userId}`
      );
      setMemberData(response.data?.data);
      setModalIsOpen(true);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const sendEmail = async () => {
    try {
      setSendingEmail(true);
      const response = await axiosInstance.post(
        `${url}/test/user-report-pdf/${userId}`
      );
      toast.success(response.data.message || "Email sent successfully");
      setSendingEmail(false);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
      setSendingEmail(false);
    }
  };

  const personalMemberInfo = [
    { title: "ID", value: memberData?.memberID },
    { title: "Names", value: memberData?.names },
    { title: "Member Since", value: memberData?.memberSince },
  ];

  return (
    <>
      <div className="ml-3">
        <ReactTooltip place="top" anchorSelect=".download">
          <span>Download Report</span>
        </ReactTooltip>
        {customButton ? (
          <div className="cursor-pointer download" onClick={generatePDF}>
            {customButton}
          </div>
        ) : (
          <FaDownload
            className="text-sm text-gray-500 cursor-pointer download"
            onClick={generatePDF}
          />
        )}

        <ReactModal
          isOpen={modalIsOpen && Boolean(memberData.generatedAt)}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700">
              Member Information
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          <div className="flex gap-4 items-center mb-4">
            <button
              onClick={() => toPDF()}
              className="bg-[#060270] hover:bg-[#060270c4] text-white font-semibold py-1 px-4 rounded mb-4 text-sm"
            >
              Download PDF
            </button>
            <button
              onClick={sendEmail}
              disabled={sendingEmail}
              className="bg-[#060270] hover:bg-[#060270c4] text-white font-semibold py-1 px-4 rounded mb-4 text-sm"
            >
              {sendingEmail ? "Sending..." : "Send Email"}
            </button>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm">
            <div ref={targetRef}>
              <h1 className="text-xl font-medium text-center mb-8 text-gray-700">
                COMPASSION SAVE TO SERVE GROUP
              </h1>
              <div className="border-b border-gray-300 mb-6 flex justify-center">
                <h1 className="text-lg font-bold text-gray-700">
                  MEMBER'S INFORMATION ON
                </h1>
                <h1 className="text-lg font-bold text-gray-700">
                  {new Date().toLocaleDateString()}
                </h1>
              </div>

              <div className="w-full flex border border-gray-300 mb-4">
                <div className="w-1/3 p-2 border-r border-gray-300">
                  <h1 className="text-sm font-semibold text-gray-600">ID</h1>
                </div>
                <div className="w-2/3 p-2 px-6">
                  <h1 className="text-sm font-normal text-gray-700">
                    {memberData?.memberID}
                  </h1>
                </div>
              </div>

              {personalMemberInfo.map((info, index) => (
                <div
                  className="w-full flex border border-t-0 border-gray-300"
                  key={index}
                >
                  <div className="w-1/3 p-2 border-r border-gray-300">
                    <h1 className="text-sm font-semibold text-gray-600">
                      {info.title}
                    </h1>
                  </div>
                  <div className="w-2/3 p-2 px-6">
                    <h1 className="text-sm font-normal text-gray-700">
                      {info.value}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ReactModal>
      </div>
    </>
  );
};

export default MemberInformationReport;
