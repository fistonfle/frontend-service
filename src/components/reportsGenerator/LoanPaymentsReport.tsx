/* eslint-disable @typescript-eslint/no-explicit-any */
import { Margin, usePDF } from "react-to-pdf";
import React, { useState } from "react";
import ReactModal from "react-modal";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxHeight: "100vh",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};

type LoanPaymentsReportProps = {
  loanId: string;
  loan: any;
};

export default function LoanPaymentsReport({
  loanId,
  loan = {},
}: LoanPaymentsReportProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const { toPDF, targetRef } = usePDF({
    filename: `loanPayments-${loan.loanNumber}.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  const { handleLogout } = React.useContext(AppContext);

  const closeModal = () => setModalIsOpen(false);

  const generate = async () => {
    try {
      const response = await axiosInstance.get(
        url + `/reports-maker/loan-payments/${loanId}`
      );
      setData(response.data?.data);
      setModalIsOpen(true);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="ml-2">
      <ReactTooltip place="top" anchorSelect=".download-loan-payments">
        <span>Loan Payments Report</span>
      </ReactTooltip>
      <FaDownload
        className="text-sm text-gray-500 cursor-pointer download-loan-payments"
        onClick={generate}
      />

      <ReactModal
        isOpen={modalIsOpen && Boolean(data?.generatedAt)}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold"></h2>
          <button onClick={closeModal}>Close</button>
        </div>

        <button
          onClick={() => toPDF()}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-5"
        >
          Download PDF
        </button>

        <div className="p-4 bg-white rounded-xl">
          <div ref={targetRef}>
            <h1 className="text-2xl font-medium text-center mb-10">
              FAM GOLD GROUP
            </h1>

            <div className="border-b border-gray-400 mb-5 flex flex-row justify-between w-full px-10">
              <div></div>
              <h1 className="text-xl font-bold text-center mb-2">
                LOAN PAYMENTS REPORT
              </h1>
              <h1 className="text-xl font-bold text-center mb-2">
                {new Date().toLocaleDateString()}
              </h1>
            </div>

            <div className="px-10 mb-6 text-sm text-gray-700">
              <div className="flex justify-between">
                <div>
                  <div>
                    <span className="font-semibold">Member:</span>{" "}
                    {data?.member?.names}
                  </div>
                  <div>
                    <span className="font-semibold">Staff ID:</span>{" "}
                    {data?.member?.memberID}
                  </div>
                </div>
                <div className="text-right">
                  <div>
                    <span className="font-semibold">Loan #:</span>{" "}
                    {data?.loanInfo?.loanNumber}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {data?.loanInfo?.status}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-between">
                <div>
                  <span className="font-semibold">Principal:</span>{" "}
                  {formatCurrency(data?.loanInfo?.principal || 0)} RWF
                </div>
                <div>
                  <span className="font-semibold">Interest:</span>{" "}
                  {formatCurrency(data?.loanInfo?.interestAmount || 0)} RWF
                </div>
                <div>
                  <span className="font-semibold">Total:</span>{" "}
                  {formatCurrency(data?.loanInfo?.totalAmount || 0)} RWF
                </div>
              </div>
            </div>

            <div className="flex border border-gray-400 mt-6">
              <div className="w-1/12 border-r border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">#</h1>
              </div>
              <div className="w-2/12 border-r border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">Date</h1>
              </div>
              <div className="w-2/12 border-r border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  Paid
                </h1>
              </div>
              <div className="w-2/12 border-r border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  Principal
                </h1>
              </div>
              <div className="w-2/12 border-r border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  Interest
                </h1>
              </div>
              <div className="w-3/12">
                <h1 className="text-sm font-semibold text-center py-2">
                  Remaining Principal
                </h1>
              </div>
            </div>

            {(data?.payments || []).map((p: any, idx: number) => (
              <div
                key={idx}
                className="flex border border-gray-400 text-sm border-t-0"
              >
                <div className="w-1/12 border-r border-gray-400">
                  <h1 className="text-sm font-light text-center py-2">
                    {p.period || idx + 1}
                  </h1>
                </div>
                <div className="w-2/12 border-r border-gray-400">
                  <h1 className="text-sm font-light text-center py-2">
                    {p.date || "-"}
                  </h1>
                </div>
                <div className="w-2/12 border-r border-gray-400">
                  <h1 className="text-sm font-light text-center py-2">
                    {formatCurrency(p.paidAmount || 0)}
                  </h1>
                </div>
                <div className="w-2/12 border-r border-gray-400">
                  <h1 className="text-sm font-light text-center py-2">
                    {formatCurrency(p.principalPaid || 0)}
                  </h1>
                </div>
                <div className="w-2/12 border-r border-gray-400">
                  <h1 className="text-sm font-light text-center py-2">
                    {formatCurrency(p.interestPaid || 0)}
                  </h1>
                </div>
                <div className="w-3/12">
                  <h1 className="text-sm font-light text-center py-2">
                    {formatCurrency(p.remainingPrincipalBalance || 0)}
                  </h1>
                </div>
              </div>
            ))}

            <div className="flex mt-2">
              <div className="w-5/12 border border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  TOTALS
                </h1>
              </div>
              <div className="w-2/12 border border-l-0 border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  {formatCurrency(data?.totals?.totalPaid || 0)}
                </h1>
              </div>
              <div className="w-2/12 border border-l-0 border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  {formatCurrency(data?.totals?.totalPrincipalPaid || 0)}
                </h1>
              </div>
              <div className="w-2/12 border border-l-0 border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">
                  {formatCurrency(data?.totals?.totalInterestPaid || 0)}
                </h1>
              </div>
              <div className="w-3/12 border border-l-0 border-gray-400">
                <h1 className="text-sm font-semibold text-center py-2">—</h1>
              </div>
            </div>

            <div className="mt-10 pb-3">
              <h1 className="text-sm font-light text-center">
                GENERATED AT{" "}
                <span className="text-sm ml-1 font-semibold text-center">
                  {data?.generatedAt}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

