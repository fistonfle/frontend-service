import React from "react";

type LoanType = {
  name: string;
  paymentMonths: number;
  interestRate: number;
  createdAt: string;
};

type LoanTypeTableProps = {
  loanTypes: LoanType[];
};

const LoanTypeTable: React.FC<LoanTypeTableProps> = ({ loanTypes }) => {
  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[22%]">Name</div>
        <div className="text-lef w-[22%]">Payment Months</div>
        <div className="text-left w-[22%]">Interest Rate</div>
        <div className="text-left w-[22%]">Created At</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {loanTypes.map((loanType, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[22%]">{loanType.name}</div>
            <div className="text-left w-[22%]">
              {loanType.paymentMonths + " months"}
            </div>
            <div className="text-left w-[22%]">{loanType.interestRate}</div>
            <div className="text-left w-[22%]">
              {loanType.createdAt
                ? new Date(loanType.createdAt).toLocaleDateString()
                : ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoanTypeTable;
