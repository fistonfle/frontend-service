/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../utils/functions";

type DebtRow = {
  userId: string;
  memberId: string;
  names: string;
  monthlyContribution: number;
  predepositBalance: number;
  unpaidMonths: number;
  totalDebt: number;
};

export default function SavingDebtsSummaryTable({
  rows,
}: {
  rows: DebtRow[];
}) {
  const [search, setSearch] = React.useState("");

  const filtered = (rows || []).filter((r) => {
    const q = search.toLowerCase();
    return (
      r.names?.toLowerCase().includes(q) ||
      r.memberId?.toLowerCase().includes(q) ||
      String(r.totalDebt || 0).includes(search) ||
      String(r.unpaidMonths || 0).includes(search)
    );
  });

  return (
    <section>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by names, member id, debt, months"
            className="border border-gray-300 p-2 rounded-md w-96 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="ml-2 bg-indigo-700 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
      </div>

      <div className="invoice-table-row invoice-table-header bg-white mt-6 rounded-xl px-6 py-3 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[22%]">Member</div>
        <div className="text-left w-[14%]">Monthly</div>
        <div className="text-left w-[14%]">Unpaid Months</div>
        <div className="text-left w-[18%]">Total Debt</div>
        <div className="text-left w-[18%]">Predeposit</div>
        <div className="text-left w-[14%]">Member ID</div>
      </div>

      <div className="bg-white mt-4 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filtered.map((r) => (
          <div
            key={r.userId}
            className="invoice-table-row flex items-center justify-between px-6 py-3"
          >
            <div className="text-left w-[22%]">{r.names}</div>
            <div className="text-left w-[14%]">
              {formatCurrency(r.monthlyContribution || 0)} RWF
            </div>
            <div className="text-left w-[14%]">{r.unpaidMonths || 0}</div>
            <div className="text-left w-[18%]">
              {formatCurrency(r.totalDebt || 0)} RWF
            </div>
            <div className="text-left w-[18%]">
              {formatCurrency(r.predepositBalance || 0)} RWF
            </div>
            <div className="text-left w-[14%]">{r.memberId}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

