import React from "react";
import { formatCurrency } from "../../utils/functions";

type IncomeActivity = {
  date: string;
  activity: string;
  amount: number;
  bankCharges: number;
  isBond: boolean;
  bondStartDate: string;
  bondEndDate: string;
  description: string;
};

type IncomeActivitiesTableProps = {
  incomeActivities: IncomeActivity[];
};

const IncomeActivitiesTable: React.FC<IncomeActivitiesTableProps> = ({
  incomeActivities,
}) => {
  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[20%]">Date</div>
        <div className="text-left w-[20%]">Activity Name</div>
        <div className="text-left w-[20%]">Amount</div>
        <div className="text-left w-[20%]">Bank Charges</div>
        <div className="text-left w-[20%]">Is Bond?</div>
        <div className="text-left w-[20%]">Description</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {incomeActivities.map((incomeActivity, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[20%]">
              {new Date(incomeActivity.date).toLocaleDateString()}
            </div>
            <div className="text-left w-[20%] pl-2">
              {incomeActivity.activity}
            </div>
            <div className="text-left w-[20%] pl-2">
              {formatCurrency(incomeActivity.amount || 0)} RWF
            </div>
            <div className="text-left w-[20%] pl-2">
              {formatCurrency(incomeActivity.bankCharges || 0)} RWF
            </div>
            <div className="text-left w-[20%] pl-2">
              {incomeActivity.isBond ? "Yes" : "No"}
              <p>
                {incomeActivity.isBond
                  ? `Start: ${new Date(
                      incomeActivity.bondStartDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
              <p>
                {incomeActivity.isBond
                  ? `End: ${new Date(
                      incomeActivity.bondEndDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <div className="text-left w-[20%] pl-2">
              {incomeActivity.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IncomeActivitiesTable;
