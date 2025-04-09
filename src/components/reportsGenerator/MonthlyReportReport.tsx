import { Margin, usePDF } from "react-to-pdf";
import React, { useState } from "react";
import ReactModal from "react-modal";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import MonthlyContributions from "./monthly/MonthlyContributions";
import MonthlyInterests from "./monthly/MonthlyInterests";
import MonthlyLoanRecovery from "./monthly/MonthlyLoanRecovery";
import AccountingSummary from "./monthly/AccountingSummary";
import AllStatementComparison from "./monthly/AllStatementComparison";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";
import * as XLSX from "xlsx"; // Import xlsx library

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxHeight: "100vh", // Set a maximum height for the content
    border: "1px solid #ccc", // Add a border around the content
    borderRadius: "8px", // Add border radius for a rounded appearance
  },
};

type MonthlyReportReportProps = {
  reportId: string;
  reportName: string;
};

// Utility function to format numbers to two decimal places
const formatNumber = (value: number) => {
  return value.toFixed(2);
};

const MonthlyReportReport = ({
  reportId,
  reportName,
}: MonthlyReportReportProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toPDF: toAccountingSummaryPDF,
    targetRef: accountingSummaryTargetRef,
  } = usePDF({
    filename: `(${reportName})_Accounting_Summary.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  const {
    toPDF: toAllStatementComparisonPDF,
    targetRef: allStatementComparisonTargetRef,
  } = usePDF({
    filename: `(${reportName})_All_Statement_Comparison.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  const {
    toPDF: toMonthlyContributionsPDF,
    targetRef: monthlyContributionsTargetRef,
  } = usePDF({
    filename: `(${reportName})_Monthly_Contributions.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  const { toPDF: toMonthlyInterestsPDF, targetRef: monthlyInterestsTargetRef } =
    usePDF({
      filename: `(${reportName})_Monthly_Interests.pdf`,
      page: { margin: Margin.MEDIUM },
    });

  const {
    toPDF: toMonthlyLoanRecoveryPDF,
    targetRef: monthlyLoanRecoveryTargetRef,
  } = usePDF({
    filename: `(${reportName})_Monthly_Loan_Recovery.pdf`,
    page: { margin: Margin.MEDIUM },
  });

  const { handleLogout } = React.useContext(AppContext);

  const toPDF = async () => {
    try {
      await toAccountingSummaryPDF();
      await toAllStatementComparisonPDF();
      await toMonthlyContributionsPDF();
      await toMonthlyInterestsPDF();
      await toMonthlyLoanRecoveryPDF();
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const generatePDF = async () => {
    try {
      const response = await axiosInstance.get(
        url + `/reports-maker/monthly-report/${reportId}`
      );
      setReportData(response.data?.data);
      setModalIsOpen(true);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const exportToExcel = () => {
    if (!reportData?.accountingSummary) {
      toast.error("No data available to export.");
      return;
    }

    // Prepare the data for Excel with raw number formatting
    const wsMembers = XLSX.utils.json_to_sheet(
      reportData.accountingSummary.members.map((member: any) => ({
        ID: member.memberID,
        Names: member.names,
        Contribution: formatNumber(member.contributions),
        PrincipalLoan: formatNumber(member.principalLoan),
        InterestPaid: formatNumber(member.interestPaid),
        LoansRecovery: formatNumber(member.loansRecovery),
        AllWithdrawals: formatNumber(member.allWithdrawals),
      }))
    );

    const wsTotals = XLSX.utils.json_to_sheet([
      {
        TotalContributions: formatNumber(
          reportData.accountingSummary.monthlyTotalContributions
        ),
        TotalPrincipalLoan: formatNumber(
          reportData.accountingSummary.monthlyTotalPrincipalLoan
        ),
        TotalInterestPaid: formatNumber(
          reportData.accountingSummary.monthlyTotalInterestPaid
        ),
        TotalLoansRecovery: formatNumber(
          reportData.accountingSummary.monthlyTotalLoansRecovery
        ),
        TotalAllWithdrawals: formatNumber(
          reportData.accountingSummary.monthlyTotalAllWithdrawals
        ),
      },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsMembers, "Members Summary");
    XLSX.utils.book_append_sheet(wb, wsTotals, "Totals Summary");

    // Generate buffer
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create a Blob with the buffer
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName}_Accounting_Summary.xlsx`;

    // Append the link to the body
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const sendReportsEmails = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        url + "/reports/send-all-users-reports"
      );
      console.log(response.data);
      toast.success("Monthly Reports sent successfully");
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

  return (
    <>
      <div className="ml-3">
        <ReactTooltip place="top" anchorSelect=".download">
          <span>Download Report</span>
        </ReactTooltip>
        <FaDownload
          className="text-sm text-gray-500 cursor-pointer download"
          onClick={generatePDF}
        />
        <ReactModal
          isOpen={modalIsOpen && Boolean(reportData)}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold"></h2>
            <button onClick={closeModal}>Close</button>
          </div>

          <button
            onClick={() => sendReportsEmails()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-5 mr-2"
          >
            Re-Send Reports to All Users
          </button>

          <button
            onClick={() => toPDF()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-5 mr-2"
          >
            Download All PDFs
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-5 mr-2"
          >
            Export to Excel
          </button>
          <div className="p-4 bg-white rounded-xl">
            <div ref={accountingSummaryTargetRef}>
              <AccountingSummary
                accountingSummary={reportData?.accountingSummary}
              />
            </div>
            <div ref={allStatementComparisonTargetRef}>
              <AllStatementComparison
                allStatementComparison={reportData?.allStatementComparison}
              />
            </div>
            <div ref={monthlyContributionsTargetRef}>
              <MonthlyContributions
                monthlyContribution={reportData?.monthlyContribution}
              />
            </div>
            <div ref={monthlyInterestsTargetRef}>
              <MonthlyInterests
                monthlyInterests={reportData?.monthlyInterest}
              />
            </div>
            <div ref={monthlyLoanRecoveryTargetRef}>
              <MonthlyLoanRecovery
                monthlyLoanRecovery={reportData?.monthlyLoanRecovery}
              />
            </div>
          </div>
        </ReactModal>
      </div>
    </>
  );
};

export default MonthlyReportReport;
