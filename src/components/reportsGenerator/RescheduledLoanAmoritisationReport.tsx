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

type RescheduledLoanAmoritisationReportProps = {
  loanId: string;
  loan: any;
};

const RescheduledLoanAmoritisationReport = ({
  loanId,
  loan,
}: RescheduledLoanAmoritisationReportProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loanData, setLoanData] = useState<any>({});
  const { toPDF, targetRef } = usePDF({
    filename: "loanAmoritisation.pdf",
    page: { margin: Margin.MEDIUM },
  });

  const { handleLogout } = React.useContext(AppContext);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const generatePDF = async () => {
    try {
      const response = await axiosInstance.get(
        url + `/reports-maker/rescheduled-loan/${loanId}`
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

  const leftSideData = [
    {
      title: "Names:",
      value: loan?.user?.firstname + " " + loan?.user?.lastname,
    },
    {
      title: "Loan Requested:",
      value: formatCurrency(loan?.amount || 0) + " RWF",
    },
    {
      title: "Interest Rate:",
      value: loan?.loanType?.interestRate * 100 + " %",
    },
    {
      title: "Term In Months:",
      value: loan?.customPaymentMonths + " months (custom)",
      //  +
      // "  ===>>    From: " +
      // loanData?.loanPaymentMonths?.start +
      // "  To: " +
      // loanData?.loanPaymentMonths?.end,
    },
    {
      title: "Monthly Payment:",
      value: formatCurrency(loan?.paymentPerMonth || 0) + " RWF",
    },
    { title: "Loan Status:", value: loan?.status },
  ];

  const rightSideData = [
    { title: "Staff ID:", value: loan?.user?.memberID },
    { title: "Loan ID:", value: loan?.loanNumber },
    { title: "Batch #", value: loan?.batch?.batchNumber },
    { title: "Bank:", value: loan?.user?.bankDetails?.bankName },
    { title: "Account Number:", value: loan?.user?.bankDetails?.accountNumber },
  ];

  // build schedule data based on the custom payment months and reschedule amount
  const scheduleData = Array.from(
    { length: loan?.customPaymentMonths },
    (_, index) => {
      const schedule = {
        period: index + 1,
        remainingMonths: loan?.customPaymentMonths - index - 1,
        paymentAmount: loan?.paymentPerMonth,
        paymentDate: new Date(
          new Date(loan?.startPaymentDate || new Date()).setMonth(
            new Date(loan?.startPaymentDate || new Date()).getMonth() + index
          )
        )
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
          ?.replace(" ", "-"),
        remainingAmount:
          loan?.rescheduleAmount - (index + 1) * loan?.paymentPerMonth,
      };
      return schedule;
    }
  );

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
                  RESCHEDULED LOAN PAYMENTS SCHEDULE{" "}
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

              {/* reschedules */}
              {loan.rescheduleHistories?.length > 0 && (
                <>
                  <div className="border-b border-gray-400 mb-5 mt-10 flex flex-row justify-center w-full px-10">
                    <div></div>
                    <h1 className="text-xl font-bold text-center mb-2">
                      PREVIOUS RESCHEDULES{" "}
                    </h1>
                  </div>

                  <div className="flex border border-gray-400 mt-4">
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

              {/* payments */}
              <div className="border-b border-gray-400 mb-5 mt-10 flex flex-row justify-center w-full px-10">
                <div></div>
                <h1 className="text-xl font-bold text-center mb-2">
                  PAYMENTS{" "}
                </h1>
              </div>

              {loanData?.payments?.length > 0 ? (
                <>
                  <div className="flex border border-gray-400 mt-4">
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Report Name
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Paid Amount
                      </h1>
                    </div>
                    <div className="w-2/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Remaining Amount{" "}
                      </h1>
                    </div>
                    <div className="w-1/6 border-r border-gray-400">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Payment Date
                      </h1>
                    </div>
                    <div className="w-1/6">
                      <h1 className="text-sm font-semibold text-center py-2">
                        Payment Type
                      </h1>
                    </div>
                  </div>
                  {loanData?.payments?.map((payment: any, index: number) => (
                    <div
                      key={index}
                      className={
                        "flex border border-gray-400 text-sm border-t-0"
                      }
                    >
                      <div className="w-1/6 border-r border-gray-400">
                        <h1 className="text-sm font-light text-center py-2">
                          {payment.report?.name}
                        </h1>
                      </div>
                      <div className="w-1/6 border-r border-gray-400">
                        <h1 className=" text-sm font-light text-center py-2">
                          {formatCurrency(payment.paidAmount || 0)}
                        </h1>
                      </div>
                      <div className="w-2/6 border-r border-gray-400">
                        <h1 className=" text-sm font-light text-center py-2">
                          {formatCurrency(payment.remainingAmount || 0)}
                        </h1>
                      </div>
                      <div className="w-1/6 border-r border-gray-400">
                        <h1 className=" text-sm font-light text-center py-2">
                          {new Date(payment.paymentDate)
                            .toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                            ?.replace(" ", "-")}
                        </h1>
                      </div>
                      <div className="w-1/6">
                        <h1 className=" text-sm font-light text-center py-2">
                          {(payment.paymentType === "MANUAL"
                            ? "Bank Deposit"
                            : payment.paymentType
                          )
                            ?.split("_")
                            .join(" ")}
                        </h1>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center">
                  <h1 className="text-sm font-semibold text-center py-2">
                    No payments made yet
                  </h1>
                </div>
              )}

              {/* schedule */}
              <div className="border-b border-gray-400 mb-5 mt-10 flex flex-row justify-center w-full px-10">
                <div></div>
                <h1 className="text-xl font-bold text-center mb-2">
                  SCHEDULE{" "}
                </h1>
              </div>

              <div className="flex border border-gray-400 mt-4">
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Period
                  </h1>
                </div>
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Remaining Months
                  </h1>
                </div>
                <div className="w-2/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Payment Amount
                  </h1>
                </div>
                <div className="w-1/6 border-r border-gray-400">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Payment Date
                  </h1>
                </div>
                <div className="w-1/6">
                  <h1 className="text-sm font-semibold text-center py-2">
                    Remaining Amount
                  </h1>
                </div>
              </div>

              {scheduleData?.map((schedule: any, index: number) => (
                <div
                  key={index}
                  className={"flex border border-gray-400 text-sm border-t-0"}
                >
                  <div className="w-1/6 border-r border-gray-400">
                    <h1 className="text-sm font-light text-center py-2">
                      {schedule.period}
                    </h1>
                  </div>
                  <div className="w-1/6 border-r border-gray-400">
                    <h1 className="text-sm font-light text-center py-2">
                      {schedule.remainingMonths + " months"}
                    </h1>
                  </div>
                  <div className="w-2/6 border-r border-gray-400">
                    <h1 className="text-sm font-light text-center py-2">
                      {formatCurrency(schedule.paymentAmount || 0)}
                    </h1>
                  </div>
                  <div className="w-1/6 border-r border-gray-400">
                    <h1 className="text-sm font-light text-center py-2">
                      {new Date(schedule.paymentDate)
                        .toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                        ?.replace(" ", "-")}
                    </h1>
                  </div>
                  <div className="w-1/6">
                    <h1 className="text-sm font-light text-center py-2">
                      {formatCurrency(schedule.remainingAmount || 0)}
                    </h1>
                  </div>
                </div>
              ))}

              {/* generated at */}
              <div className="mt-20 pb-5">
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

export default RescheduledLoanAmoritisationReport;
