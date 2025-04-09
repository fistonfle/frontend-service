/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ReactModal from "react-modal";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import ReportForm from "./ReportForm";
import MonthlyReportReport from "../reportsGenerator/MonthlyReportReport";
import ReportMonthlyInterestsDistribution from "./ReportMonthlyInterestsDistribution";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type Report = {
  id: string;
  name: string;
  date: string;
};

type ReportsTableProps = {
  reports: Report[];
  reloadReports: () => void;
};

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
  },
};

const ReportsTable: React.FC<ReportsTableProps> = ({
  reports,
  reloadReports,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Partial<Report>>({});

  const { handleLogout } = React.useContext(AppContext);

  const openModal = (report: Report) => {
    setModalIsOpen(true);
    setModalIsOpen2(false);
    setSelectedReport(report);
  };

  const openModal2 = (report: Report) => {
    setModalIsOpen2(true);
    setModalIsOpen(false);
    setSelectedReport(report);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalIsOpen2(false);
    setSelectedReport({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const saveReport = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        url + `/reports/${selectedReport.id}`,
        {
          name: selectedReport.name,
        }
      );
      console.log(response.data);
      toast.success("Report saved successfully");
      closeModal();
      reloadReports();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const deleteReport = async (id: string) => {
  //   try {
  //     const response = await axiosInstance.delete(url + `/reports/${id}`);
  //     console.log(response.data);
  //     toast.success("Report deleted successfully");
  //     reloadReports();
  //   } catch (error: any) {
  //     handleApiError(error, handleLogout);
  //     console.log(error);
  //     const errorMessage =
  //       error.response.data.message || "Something went wrong";
  //     toast.error(errorMessage);
  //   }
  // };

  return (
    <section>
      <ReactModal
        isOpen={modalIsOpen || modalIsOpen2}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold">
            {modalIsOpen ? "Edit Report" : "Report Monthly Interests"}
          </h1>
          <button onClick={closeModal}>Close</button>
        </div>
        {modalIsOpen ? (
          <ReportForm
            newReport={{
              name: selectedReport.name || "",
              date: selectedReport.date
                ? new Date(selectedReport.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            }}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSave={saveReport}
            onClose={closeModal}
            hideDate={true}
          />
        ) : (
          <ReportMonthlyInterestsDistribution
            reportId={selectedReport.id ?? ""}
            onClose={closeModal}
          />
        )}
      </ReactModal>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[33%]">Name</div>
        <div className="text-left w-[33%]">Date</div>
        <div className="text-center w-[33%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {reports.map((report, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[33%]">{report.name}</div>
            <div className="text-left w-[33%]">
              {new Date(report.date).toLocaleDateString()}
            </div>
            <div className="w-[33%] flex items-center justify-center">
              <button
                className="text-indigo-600 hover:text-indigo-900 ml-2"
                onClick={() => openModal(report)}
              >
                Edit
              </button>
              {/* <button
                className="text-red-600 hover:text-red-900 ml-2"
                onClick={() => deleteReport(report.id)}
              >
                Delete
              </button> */}
              <MonthlyReportReport
                reportId={report.id}
                reportName={report.name}
              />
              <button
                className="text-indigo-600 hover:text-indigo-900 ml-2"
                onClick={() => openModal2(report)}
              >
                Interests
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReportsTable;
