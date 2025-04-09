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
    maxHeight: "100vh", // Set a maximum height for the content
    // overflowY: "auto", // Enable vertical scrolling
    border: "1px solid #ccc", // Add a border around the content
    borderRadius: "8px", // Add border radius for a rounded appearance
  },
};

type LoanAmoritisationReportProps = {
  loanId: string;
  loan: any;
};

const LoanAmoritisationReport = ({
  loanId,
  loan = {},
}: LoanAmoritisationReportProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loanData, setLoanData] = useState<any>({});
  const { toPDF, targetRef } = usePDF({
    // filename: "loanAmoritisation.pdf",
    filename: `loanAmoritisation-${loan.loanNumber}.pdf`, // Set the filename of the PDF (default is "document.pdf")
    page: { margin: Margin.MEDIUM },
  });

  const { handleLogout } = React.useContext(AppContext);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const generatePDF = async () => {
    try {
      const response = await axiosInstance.get(
        url + `/reports-maker/loan/${loanId}`
      );
      setLoanData(response.data?.data);
      setModalIsOpen(true);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const paymentStartDateFormatted = new Date(
    loan.startPaymentDate || loan.date
  ).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const paymentEndDateFormatted = new Date(
    new Date(loan.startPaymentDate || loan.date).setMonth(
      new Date(loan.startPaymentDate || loan.date).getMonth() +
        (loanData.amortization?.schedule?.length - 1)
    )
  ).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const leftSideData = [
    { title: "Names:", value: loanData?.names },
    {
      title: "Loan Requested:",
      value: formatCurrency(loanData?.loanRequestedAmount),
    },
    { title: "Interest Rate:", value: loanData?.loanInterestRate * 100 + " %" },
    {
      title: "Term In Months:",
      value:
        // loanData?.loanPaymentMonths?.totalMonths +
        // "  ===>>    From: " +
        // loanData?.loanPaymentMonths?.start +
        // "  To: " +
        // loanData?.loanPaymentMonths?.end,
        (loan.status === "RESCHEDULED"
          ? loan?.customPaymentMonths + " months (custom)"
          : loanData?.loanPaymentMonths?.totalMonths) +
        "  ===>>    From: " +
        paymentStartDateFormatted +
        "  To: " +
        paymentEndDateFormatted,
    },
    {
      title: "Monthly Payment:",
      value: formatCurrency(loanData?.monthlyPayment),
    },
  ];

  const rightSideData = [
    { title: "Staff ID:", value: loanData?.memberID },
    { title: "Loan ID:", value: loanData?.loanId },
    { title: "Batch #", value: loanData?.batch },
    { title: "Bank:", value: loanData?.bankDetails?.bankName },
    { title: "Account Number:", value: loanData?.bankDetails?.accountNumber },
  ];

  return (
    <>
      <div className="ml-2">
        {/* <button
          className="bg-[#4338ca] hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={generatePDF}
        >
          Report
        </button> */}
        <ReactTooltip place="top" anchorSelect=".download-report">
          <span>Download Report</span>
        </ReactTooltip>
        <FaDownload
          className="text-sm text-gray-500 cursor-pointer download-report"
          onClick={generatePDF}
        />
        <ReactModal
          isOpen={modalIsOpen && Boolean(loanData.generatedAt)}
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
              <h1 className="text-2xl font-medium text-center mb-20">
                COMPASSION SAVE TO SERVE GROUP
              </h1>
              <div className="border-b border-gray-400 mb-5 flex flex-row justify-between w-full px-10">
                <div></div>
                <h1 className="text-xl font-bold text-center mb-2">
                  LOAN AMORTIZATION SCHEDULE{" "}
                </h1>
                <h1 className="text-xl font-bold text-center mb-2">
                  {new Date().toLocaleDateString()}
                </h1>
              </div>

              <div className="flex items-center justify-between">
                <div className="w-1/2">
                  {leftSideData.map((data, index) => (
                    <div key={index} className="flex">
                      <div className="w-1/3">
                        <h1 className="text-sm font-normal">{data.title}</h1>
                      </div>
                      <div className="flex-1">
                        <h1 className="text-sm font-semibold">{data.value}</h1>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-1/2">
                  {rightSideData.map((data, index) => (
                    <div key={index} className="flex justify-end">
                      <div className="w-1/3">
                        <h1 className="text-sm font-normal">{data.title}</h1>
                      </div>
                      <div className="w-1/3">
                        <h1 className="text-sm font-semibold">{data.value}</h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* payments */}
              {/* reschedules */}
              {loan.rescheduleHistories?.length > 1 && (
                <>
                  <div className="border-b border-gray-400 mb-5 mt-10 flex flex-row justify-center w-full px-10">
                    <div></div>
                    <h1 className="text-xl font-bold text-center mb-2">
                      PREVIOUS RESCHEDULES{" "}
                    </h1>
                  </div>

                  <div className="flex border border-gray-400 mt-10">
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Date
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Prev Amount
                      </h1>
                    </div>
                    <div className="w-2/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Prev Payment Per Month
                      </h1>
                    </div>
                    <div className="w-2/6">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Prev Payment Months
                      </h1>
                    </div>
                  </div>

                  {loan.rescheduleHistories
                    ?.sort((a: any, b: any) => {
                      return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                      );
                    })
                    ?.map((reschedule: any, index: number) => (
                      <div
                        key={index}
                        className={
                          "flex border border-gray-400 text-sm border-t-0"
                        }
                      >
                        <div className="w-1/6 border-r border-gray-400">
                          <h1 className="text-sm font-light text-center py-2">
                            {new Date(
                              reschedule.createdAt
                            ).toLocaleDateString()}
                          </h1>
                        </div>
                        <div className="w-1/6 border-r border-gray-400">
                          <h1 className=" text-sm font-light text-center py-2">
                            {formatCurrency(reschedule.prevAmount || 0)}
                          </h1>
                        </div>
                        <div className="w-2/6 border-r border-gray-400">
                          <h1 className=" text-sm font-light text-center py-2">
                            {formatCurrency(
                              reschedule.prevPaymentPerMonth || 0
                            )}
                          </h1>
                        </div>
                        <div className="w-2/6">
                          <h1 className=" text-sm font-light text-center py-2">
                            {reschedule.prevPaymentMonths}
                          </h1>
                        </div>
                      </div>
                    ))}
                </>
              )}

              {/* loan details */}

              <div className="flex border border-gray-400 mt-10">
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Period
                  </h1>
                </div>
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Months
                  </h1>
                </div>
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Beginning Principal Balance
                  </h1>
                </div>
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Interest Paid
                  </h1>
                </div>
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Principal Paid
                  </h1>
                </div>
                <div className="w-1/6">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Remaining Principal Amount
                  </h1>
                </div>
              </div>

              {loanData?.amortization?.schedule?.map(
                (schedule: any, index: number) => (
                  <div
                    key={index}
                    className={"flex border border-gray-400 text-sm border-t-0"}
                  >
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {schedule.paymentNumber}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {/* {payment.month} ex: Apr-2024 or May-2024 */}
                        {/* calculate from loan.date as starting payment date and calculate the month */}
                        {new Date(
                          new Date(loan.startPaymentDate || loan.date).setMonth(
                            new Date(
                              loan.startPaymentDate || loan.date
                            ).getMonth() +
                              schedule.paymentNumber -
                              1
                          )
                        )
                          .toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                          ?.replace(" ", "-")}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(schedule.beginningPrincipalBalance)}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(schedule.interestPayment)}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(schedule.principalPayment)}
                      </h1>
                    </div>
                    <div className="w-1/6">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(schedule.remainingPrincipalBalance)}
                      </h1>
                    </div>
                  </div>
                )
              )}
              {/* {loanData?.paymentsSchedule?.payments?.map(
                (payment: any, index: number) => (
                  <div
                    key={index}
                    className={"flex border border-gray-400 text-sm border-t-0"}
                  >
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {payment.period}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {payment.month}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(payment.beginningPrincipalBalance)}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(payment.interestPaid)}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(payment.principalPaid)}
                      </h1>
                    </div>
                    <div className="w-1/6">
                      <h1 className="text-sm font-light text-center py-2">
                        {formatCurrency(payment.remainingPrincipalBalance)}
                      </h1>
                    </div>
                  </div>
                )
              )} */}

              {/* totals */}
              <div className="flex mt-1">
                <div className="w-1/2 border border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    {"T O T A L S ===>>"}
                  </h1>
                </div>
                <div className="w-1/6 border border-l-0 border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    {formatCurrency(
                      loanData?.paymentsSchedule?.totalInterestPaid
                    )}
                  </h1>
                </div>
                <div className="w-1/6 border border-l-0 border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    {formatCurrency(
                      loanData?.paymentsSchedule?.totalPrinciplePaid
                    )}
                  </h1>
                </div>
              </div>

              {/* generated at */}
              <div className="mt-40 pb-5">
                <h1 className="text-sm font-light text-center">
                  GENERATED AT{" "}
                  <span className="text-sm ml-1 font-semibold text-center">
                    {loanData?.generatedAt}
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    </>
  );
};

export default LoanAmoritisationReport;
