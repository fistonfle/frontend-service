/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../utils/functions";

type SavingTotal = {
  id: string;
  user: any;
  totalAmount: number;
};

type SavingTotalsTableProps = {
  savingTotals: SavingTotal[];
};

const SavingTotalsTable: React.FC<SavingTotalsTableProps> = ({
  savingTotals,
}) => {
  const [search, setSearch] = React.useState("");

  const filteredSavingTotals = savingTotals.filter((savingTotal) => {
    return (
      savingTotal.user?.firstname
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      savingTotal.user?.lastname
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      savingTotal.totalAmount?.toString().includes(search)
    );
  });
  return (
    <section>
      {/* search container and input */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by names, total amount"
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
        <div className="text-left w-[40%]">Names</div>
        <div className="text-left w-[40%]">Total Amount</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filteredSavingTotals.map((savingTotal, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[40%]">
              {savingTotal.user?.firstname} {savingTotal.user?.lastname}
            </div>
            <div className="text-left w-[40%] pl-2">
              {formatCurrency(savingTotal.totalAmount || 0)} RWF
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavingTotalsTable;
