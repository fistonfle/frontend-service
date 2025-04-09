import React from "react";
import { formatCurrency } from "../../utils/functions";

type ExpenseActivity = {
  date: string;
  activity: string;
  amount: number;
  isBond: boolean;
  bondStartDate: string;
  bondEndDate: string;
  description: string;
};

type ExpenseActivitiesTableProps = {
  expenseActivities: ExpenseActivity[];
};

const ExpenseActivitiesTable: React.FC<ExpenseActivitiesTableProps> = ({
  expenseActivities,
}) => {
  return (
    <section>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[20%]">Date</div>
        <div className="text-left w-[20%]">Activity Name</div>
        <div className="text-left w-[20%]">Amount</div>
        <div className="text-left w-[20%]">Is Bond?</div>
        <div className="text-left w-[20%]">Description</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {expenseActivities.map((expenseActivity, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[20%]">
              {new Date(expenseActivity.date).toLocaleDateString()}
            </div>
            <div className="text-left w-[20%] pl-2">
              {expenseActivity.activity}
            </div>
            <div className="text-left w-[20%] pl-2">
              {formatCurrency(expenseActivity.amount || 0)} RWF
            </div>
            <div className="text-left w-[20%] pl-2">
              {expenseActivity.isBond ? "Yes" : "No"}
              <p>
                {expenseActivity.isBond
                  ? `Start: ${new Date(
                      expenseActivity.bondStartDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
              <p>
                {expenseActivity.isBond
                  ? `End: ${new Date(
                      expenseActivity.bondEndDate
                    ).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <div className="text-left w-[20%] pl-2">
              {expenseActivity.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpenseActivitiesTable;
