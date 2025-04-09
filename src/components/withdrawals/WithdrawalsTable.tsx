/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../utils/functions";

type Withdraw = {
  id: string;
  batch: any;
  user: any;
  withdrawAmount: number;
  remainingAmount: number;
  withdrawType: string;
  isRelatedToPartialExit: boolean;
};

type WithdrawalsTableProps = {
  withdrawals: Withdraw[];
};

const WithdrawalsTable: React.FC<WithdrawalsTableProps> = ({ withdrawals }) => {
  const [search, setSearch] = React.useState("");

  const filteredWithdrawals = withdrawals.filter((withdraw) => {
    return (
      withdraw.user?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      withdraw.user?.lastname?.toLowerCase().includes(search.toLowerCase()) ||
      withdraw.withdrawAmount?.toString().includes(search) ||
      withdraw.remainingAmount?.toString().includes(search) ||
      withdraw.withdrawType?.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <section>
      {/* search container and input */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by names, withdraw amount, remaining amount, withdraw type"
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
        <div className="text-left w-[25%]">Names</div>
        <div className="text-left w-[25%]">Withdraw Amount</div>
        <div className="text-left w-[25%]">Remaining Amount</div>
        <div className="text-left w-[25%]">Withdraw Type</div>
        <div className="text-left w-[25%]">Related to Partial Exit</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filteredWithdrawals.map((saving, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[25%]">
              {saving.user?.firstname} {saving.user?.lastname}
            </div>
            <div className="text-left w-[25%] pl-2">
              {formatCurrency(saving.withdrawAmount || 0)} RWF
            </div>
            <div className="text-left w-[25%] pl-2">
              {formatCurrency(saving.remainingAmount || 0)} RWF
            </div>
            <div className="text-left w-[25%] pl-2">
              {(saving.withdrawType === "MANUAL"
                ? "WITHDRAW"
                : saving.withdrawType
              )
                ?.split("_")
                .join(" ")}
            </div>
            <div className="text-left w-[25%]">
              {saving.isRelatedToPartialExit ? "Yes" : "No"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WithdrawalsTable;
