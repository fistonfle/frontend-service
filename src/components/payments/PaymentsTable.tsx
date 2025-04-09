/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../utils/functions";

type Payment = {
  id: string;
  loan: any;
  report: any;
  paidAmount: number;
  remainingAmount: number;
  paymentPerMonth: number;
  paymentDate: string;
  paymentType: string;
};
type PaymentsTableProps = {
  payments: Payment[];
};

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
  const [search, setSearch] = React.useState("");

  const filteredPayments = payments.filter((payment) => {
    return (
      payment.loan?.user?.firstname
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.loan?.user?.lastname
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.report?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.paidAmount?.toString().includes(search) ||
      payment.remainingAmount?.toString().includes(search) ||
      payment.paymentPerMonth?.toString().includes(search) ||
      payment.paymentDate?.includes(search) ||
      payment.paymentType?.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <section>
      {/* search container and input */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by names, report name, paid amount, remaining amount, payment date, payment type"
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
        <div className="text-left w-[14%]">Names</div>
        <div className="text-left w-[14%]">Report Name</div>
        <div className="text-left w-[14%]">Paid Amount</div>
        <div className="text-left w-[14%]">Remaining Amount</div>
        <div className="text-left w-[14%]">Payment Date</div>
        <div className="text-left w-[20%]">Payment Type</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filteredPayments.map((payment, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[14%]">
              {payment.loan?.user?.firstname} {payment.loan?.user?.lastname}
            </div>
            <div className="text-left w-[14%] pl-2">{payment.report?.name}</div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(payment.paidAmount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {formatCurrency(payment.remainingAmount || 0)} RWF
            </div>
            <div className="text-left w-[14%] pl-2">
              {new Date(payment.paymentDate).toLocaleDateString()}
            </div>
            <div className="text-left w-[20%] pl-2">
              {(payment.paymentType === "MANUAL"
                ? "Bank Deposit"
                : payment.paymentType
              )
                ?.split("_")
                .join(" ")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentsTable;
