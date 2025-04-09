/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import LoanAmoritisationReport from "../reportsGenerator/LoanAmoritisationReport";
import RescheduleButton from "./RescheduleButton";
import RescheduledLoanAmoritisationReport from "../reportsGenerator/RescheduledLoanAmoritisationReport";
import { formatCurrency } from "../../utils/functions";

type Loan = {
  id: string;
  loanNumber: string;
  date: string;
  loanTypeId: string;
  loanType: any;
  amount: number;
  customPaymentMonths: number;
  paymentDate: string;
  startPaymentDate: string;
  paymentPerMonth: number;
  reportId: string;
  report: any;
  status: string;
  interestAmount: number;
  userId: string;
  user: any;
  totalAmount: number;
  rescheduleAmount: number;
};
type LoansTableProps = {
  loans: Loan[];
  reloadLoans: () => void;
};

const LoansTable: React.FC<LoansTableProps> = ({ loans, reloadLoans }) => {
  const [search, setSearch] = React.useState("");

  const filteredLoans = loans.filter((loan) => {
    return (
      loan.user?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      loan.user?.lastname?.toLowerCase().includes(search.toLowerCase()) ||
      loan.loanNumber
        ?.toString()
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      loan.loanType?.name?.toLowerCase().includes(search.toLowerCase()) ||
      loan.amount?.toString().includes(search) ||
      loan.interestAmount?.toString().includes(search) ||
      loan.paymentPerMonth?.toString().includes(search) ||
      loan.paymentDate?.includes(search) ||
      loan.status?.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <section>
      {/* search container and input */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by names, loan number, loan type, amount, interest amount, payment per month, payment date, status"
            className="border border-gray-300 p-2 rounded-md w-96 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="ml-2 bg-indigo-700 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
        <div className="flex items-center">
          {/* <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
            Export
          </button> */}
        </div>
      </div>
      {/* End of search container and input */}
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[10%]">Loan Number</div>
        <div className="text-left w-[14%]">Names</div>
        <div className="text-left w-[9%]">Loan Type</div>
        <div className="text-left w-[14%]">Loan Amount</div>
        <div className="text-left w-[14%]">Interest Amount</div>
        <div className="text-left w-[14%]">Total Amount</div>
        <div className="text-left w-[14%]">Payment Per Month</div>
        <div className="text-left w-[9%]">Payment Date</div>
        <div className="text-left w-[14%]">Status</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filteredLoans.map((loan, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[10%]">{loan.loanNumber}</div>
            <div className="text-left w-[14%]">
              {loan.user?.firstname} {loan.user?.lastname}
            </div>
            <div className="text-left w-[9%] pl-2">
              {loan.loanType?.name || loan.loanType?.paymentMonths + " months"}
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(loan.amount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(loan.interestAmount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(loan.amount + loan.interestAmount)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(loan.paymentPerMonth || 0)} RWF
            </div>
            <div className="text-left w-[9%] pl-2">
              {/* {new Date(loan.startPaymentDate).toLocaleDateString()} -{" "} */}
              {/* Display original date */}
              {(() => {
                // Calculate the number of months to add
                const paymentMonths =
                  loan.customPaymentMonths || loan.loanType.paymentMonths;

                // Function to add months to a date
                function addMonths(date: Date, months: number) {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() + months);
                  return newDate;
                }

                // Calculate the new payment date
                const newPaymentDate = addMonths(
                  new Date(loan.startPaymentDate),
                  paymentMonths
                );

                // Return the formatted new date
                return newPaymentDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              })()}
            </div>
            <div className="text-left w-[14%] pl-2 flex items-center">
              {loan.status === "PAID" ? (
                <span className="px-2 text-[12px] py-[2px] rounded-lg bg-green-400  text-white">
                  {loan.status}
                </span>
              ) : (
                <span className="px-2 text-[12px] py-[2px] rounded-lg bg-indigo-400  text-white">
                  {loan.status}
                </span>
              )}
              <RescheduleButton
                loan={loan}
                onRescheduleComplete={reloadLoans}
              />
              {loan.status === "RESCHEDULED" &&
              loan.rescheduleAmount !== loan.totalAmount ? (
                <RescheduledLoanAmoritisationReport
                  loanId={loan.id}
                  loan={loan}
                />
              ) : (
                <LoanAmoritisationReport loanId={loan.id} loan={loan} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoansTable;
