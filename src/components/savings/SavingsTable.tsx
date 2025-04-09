/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../utils/functions";

type Saving = {
  id: string;
  report: any;
  reportId: any;
  user: any;
  userId: any;
  savingAmount: number;
  totalAmount: number;
  savingTotals: any;
  savingType: string;
  incomeActivity?: any;
};

type SavingsTableProps = {
  savings: Saving[];
};

const SavingsTable: React.FC<SavingsTableProps> = ({ savings }) => {
  const [search, setSearch] = React.useState("");

  const filteredSavings = savings.filter((saving) => {
    return (
      saving.user?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      saving.user?.lastname?.toLowerCase().includes(search.toLowerCase()) ||
      saving.report?.name?.toLowerCase().includes(search.toLowerCase()) ||
      saving.savingAmount.toString().includes(search) ||
      saving.totalAmount.toString().includes(search) ||
      saving.savingType?.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <section>
      {/* search container and input */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name, report name, savings amount, total amount, savings type"
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
        <div className="text-left w-[20%]">Names</div>
        <div className="text-left w-[20%]">Report Name</div>
        <div className="text-left w-[20%]">Savings Amount</div>
        <div className="text-left w-[20%]">Total Amount</div>
        <div className="text-left w-[20%]">Savings Type</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filteredSavings.map((saving, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[20%]">
              {saving.user?.firstname} {saving.user?.lastname}
            </div>
            <div className="text-left w-[20%] pl-2">
              {saving.report?.name || saving.incomeActivity?.report?.name}
            </div>
            <div className="text-left w-[20%] pl-2">
              {formatCurrency(saving.savingAmount || 0)} RWF
            </div>
            <div className="text-left w-[20%] pl-2">
              {formatCurrency(saving.totalAmount || 0)} RWF
            </div>
            <div className="text-left w-[20%] pl-2">
              {(saving.savingType === "MANUAL"
                ? "Bank Deposit"
                : saving.savingType
              )
                ?.split("_")
                .join(" ") +
                " (" +
                (saving.report?.name || saving.incomeActivity?.activity) +
                ")"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavingsTable;
