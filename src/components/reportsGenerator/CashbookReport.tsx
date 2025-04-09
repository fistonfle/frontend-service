/* eslint-disable @typescript-eslint/no-explicit-any */
import { Margin, usePDF } from "react-to-pdf";
import Input from "../reusable/Input";
import React, { ChangeEvent, useState } from "react";
import ReactModal from "react-modal";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
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
    width: "98%",
    maxHeight: "90vh", // Set a maximum height for the content
    // overflowY: "auto", // Enable vertical scrolling
    border: "1px solid #ccc", // Add a border around the content
    borderRadius: "8px", // Add border radius for a rounded appearance
  },
};

const CashbookReport = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cashbookData, setCashbookData] = useState<any>({});
  const { toPDF, targetRef } = usePDF({
    filename: "cashbook.pdf",
    page: { margin: Margin.MEDIUM },
  });

  const { handleLogout } = React.useContext(AppContext);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const generatePDF = async () => {
    try {
      if (!from || !to) {
        toast.error("Select start date and end date");
        return;
      }
      const response = await axiosInstance.get(
        url + `/reports-maker/cashbook?startDate=${from}&endDate=${to}`
      );
      setCashbookData(response.data?.data);
      setModalIsOpen(true);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <div className="p-4 bg-white">
        <div className="flex flex-row items-center gap-8">
          <Input
            type="date"
            name="from"
            label="From"
            value={from}
            onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFrom(e.target.value)
            }
          />
          <Input
            type="date"
            name="to"
            label="To"
            value={to}
            onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTo(e.target.value)
            }
          />
        </div>
        <button
          className="bg-[#4338ca] hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={generatePDF}
        >
          Generate Report
        </button>
      </div>
      <ReactModal
        isOpen={modalIsOpen && Boolean(cashbookData.generatedAt)}
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
            <h1 className="text-3xl font-bold text-center mb-5">
              COMPASSION SAVE TO SERVE GROUP
            </h1>
            <h1 className="text-2xl font-bold text-center mb-5">
              CASH BOOK / BANK RECONCILIATION
            </h1>
            <h1 className="text-xl font-bold text-center mb-5">
              FROM {cashbookData.from} TO {cashbookData.to}
            </h1>
            <h1 className="text-sm font-light text-center mb-5">
              GENERATED AT {cashbookData.generatedAt}
            </h1>
            {/* dashed line */}
            <div className="border-b border-dashed border-gray-400 mb-10"></div>
            <div className="invoice-table-row invoice-table-header bg-white mt-10 px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600 border border-gray-400">
              <div className="text-left w-full">Date</div>
              <div className="text-left w-full">Particulars</div>
              <div className="text-left w-full px-2">Credit</div>
              <div className="text-left w-full">Debit</div>
              <div className="text-left w-full">Balance</div>
            </div>
            {(cashbookData.cashbooks || []).map((entry: any, index: number) => (
              <div
                className="bg-white text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto border-x border-b border-gray-400"
                key={index}
              >
                <div className="invoice-table-row flex items-center justify-between px-10 py-4">
                  <div className="text-left w-full">{entry.date}</div>
                  <div className="text-left w-full">{entry.particulars}</div>
                  <div className="text-left w-full px-2">
                    {formatCurrency(entry.debit || "") + " RWF"}
                  </div>
                  <div className="text-left w-full">
                    {formatCurrency(entry.credit || "") + " RWF"}
                  </div>
                  <div className="text-left w-full">
                    {formatCurrency(entry.balance || "") + " RWF"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default CashbookReport;
