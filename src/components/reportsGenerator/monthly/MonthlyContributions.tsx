/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../../utils/functions";

type Props = {
  monthlyContribution: any;
};

const MonthlyContributions = ({ monthlyContribution = {} }: Props) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-medium text-center mb-10">
        COMPASSION SAVE TO SERVE GROUP
      </h1>
      <div className="border-b border-gray-400 flex items-center justify-center gap-4 pb-4">
        <h1 className="text-xl font-bold text-center mb-2">
          MONTHLY CONTRIBUTIONS:
        </h1>
        <h1 className="text-xl font-bold text-center mb-2">
          {monthlyContribution.month}
        </h1>
      </div>

      {/* member contributions */}
      <div className="flex border border-gray-400 mt-4">
        <div className=" w-[50%] border-r border-gray-400">
          <h1 className="text-md font-semibold text-left py-2 px-10">Member</h1>
          <div className="flex justify-between items-center px-10 border-t border-gray-400">
            <h1 className="text-sm font-semibold w-1/6 border-r border-gray-400 p-2">
              ID #
            </h1>
            <h1 className="text-sm font-semibold flex-1 pl-4">Names</h1>
          </div>
        </div>
        <div className=" flex-1">
          <h1 className="text-md font-semibold text-left py-2 px-10">
            Contributions
          </h1>
          <div className="flex justify-between items-center px-10 border-t border-gray-400">
            <h1 className="text-sm font-semibold w-1/2 border-r border-gray-400 p-2">
              Monthly
            </h1>
            <h1 className="text-sm font-semibold flex-1 pl-4">Cumulative</h1>
          </div>
        </div>
      </div>

      {/* member contributions data */}
      {monthlyContribution?.members?.map((member: any, index: number) => (
        <div key={index} className="flex border-b border-x border-gray-400">
          <div className=" w-[50%] border-r border-gray-400">
            <div className="flex justify-between items-center px-10">
              <h1 className="text-sm font-normal w-1/6 border-r border-gray-400 p-2">
                {member.memberID}
              </h1>
              <h1 className="text-sm font-normal flex-1 pl-4">
                {member.names}
              </h1>
            </div>
          </div>
          <div className=" flex-1">
            <div className="flex justify-between items-center px-10">
              <h1 className="text-sm font-light w-1/2 border-r border-gray-400 p-2">
                {formatCurrency(member.contributions?.monthly)} RWF
              </h1>
              <h1 className="text-sm font-light flex-1 pl-4">
                {formatCurrency(member.contributions?.cumulative)} RWF
              </h1>
            </div>
          </div>
        </div>
      ))}

      {/* total contributions */}
      <div className="flex border border-gray-400 border-t-0">
        <div className=" w-[50%] border-r border-gray-400">
          <h1 className="text-md font-semibold text-center py-2 px-10">
            {"T O T A L S =====>>>>"}
          </h1>
        </div>
        <div className=" flex-1 flex px-10">
          <h1 className="text-md font-semibold text-left py-2 px-2 w-1/2 border-r border-gray-400">
            {formatCurrency(monthlyContribution?.totals?.monthly)} RWF
          </h1>
          <h1 className="text-md font-semibold text-left py-2 px-4 flex-1">
            {formatCurrency(monthlyContribution?.totals?.cumulative)} RWF
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MonthlyContributions;
