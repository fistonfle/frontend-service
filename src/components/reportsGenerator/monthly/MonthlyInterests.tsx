/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../../utils/functions";

type Props = {
  monthlyInterests: any;
};

const MonthlyInterests = ({ monthlyInterests = {} }: Props) => {
  return (
    <div className="w-full mt-40">
      <h1 className="text-2xl font-medium text-center mb-10">
        COMPASSION SAVE TO SERVE GROUP
      </h1>
      <div className="border border-gray-400 w-[50%] mx-auto mb-10">
        <div className="flex items-center justify-between gap-8 p-4">
          <h1 className="text-xl font-bold text-center mb-2">
            MONTHLY earned INTERESTS:
          </h1>
          <h1 className="text-xl font-bold text-center mb-2">
            {formatCurrency(monthlyInterests.monthlyEarnedInterests)} RWF
          </h1>
        </div>
        <div className="flex items-center justify-between gap-8 p-4 pt-0">
          <h1 className="text-xl font-bold text-center mb-2">
            Pending recorded CHARGES:
          </h1>
          <h1 className="text-xl font-bold text-center mb-2">
            {formatCurrency(monthlyInterests.pendingRecordedCharges)} RWF
          </h1>
        </div>
        <div className="flex items-center justify-between gap-8 border-t border-gray-400 p-2">
          <h1 className="text-xl font-bold text-center mb-2">
            Interests to DISTRIBUTE
          </h1>
          <h1 className="text-xl font-bold text-center mb-2">
            {formatCurrency(monthlyInterests.interestsToDistribute)} RWF
          </h1>
        </div>
      </div>
      <div className="border-b border-gray-400 flex items-center justify-center gap-4 pb-4">
        <h1 className="text-xl font-bold text-center mb-2">
          MONTHLY INTERESTS DISTRIBUTION FOR:
        </h1>
        <h1 className="text-xl font-bold text-center mb-2">
          {formatCurrency(monthlyInterests.month)} RWF
        </h1>
      </div>

      {/* headers */}
      <div className="flex border border-gray-400 mt-4">
        <div className="w-[60%] min-h-full border-r border-gray-400 flex">
          <h1 className="text-md font-semibold text-center flex items-center justify-center w-[20%] h-full border-r border-gray-400">
            ID
          </h1>
          <h1 className="text-md font-semibold text-left py-2 m-auto w-[50%] border-r border-gray-400 h-full flex items-center justify-center">
            MEMBER'S NAMES
          </h1>
          <h1 className="text-md font-semibold text-left py-2 m-auto w-[30%] h-full flex items-center justify-center">
            MONTHLY INTERESTS
          </h1>
        </div>
        <div className="w-[40%] flex flex-col">
          <h1 className="text-md font-semibold text-center py-2 pl-4 border-b border-gray-400">
            CONTRIBUTIONS
          </h1>
          <div className="flex">
            <h1 className="text-sm font-semibold w-1/2 border-r border-gray-400 p-2 text-center">
              BEFORE
            </h1>
            <h1 className="text-sm font-semibold flex-1 p-2 text-center">
              AFTER
            </h1>
          </div>
        </div>
      </div>

      {/* data */}
      {monthlyInterests?.interests?.map((entry: any, index: number) => {
        return (
          <div key={index} className="flex border-b border-x border-gray-400">
            <div className="w-[60%] min-h-full border-r border-gray-400 flex">
              <h1 className="text-sm font-normal text-center flex items-center justify-center w-[20%] h-full border-r border-gray-400">
                {entry.memberID}
              </h1>
              <h1 className="text-sm font-normal text-left py-2 m-auto w-[50%] border-r border-gray-400 h-full flex items-center justify-center">
                {entry.names}
              </h1>
              <h1 className="text-sm font-normal text-left py-2 m-auto w-[30%] h-full flex items-center justify-center">
                {formatCurrency(entry.interest)} RWF
              </h1>
            </div>
            <div className="w-[40%] flex flex-col">
              <div className="flex">
                <h1 className="text-sm font-light w-1/2 border-r border-gray-400 p-2 text-center">
                  {formatCurrency(entry.contributions?.before)} RWF
                </h1>
                <h1 className="text-sm font-light flex-1 p-2 text-center">
                  {formatCurrency(entry.contributions?.after)} RWF
                </h1>
              </div>
            </div>
          </div>
        );
      })}

      {/* totals */}
      <div className="flex border-b border-x border-gray-400">
        <div className="w-[60%] min-h-full border-r border-gray-400 flex">
          <h1 className="text-md font-semibold text-center flex items-center justify-center w-[70%] h-full border-r border-gray-400">
            SUMMARY
          </h1>
          <h1 className="text-md font-semibold text-left py-2 m-auto w-[30%] h-full flex items-center justify-center">
            {formatCurrency(monthlyInterests?.totals?.monthlyInterests)} RWF
          </h1>
        </div>
        <div className="w-[40%] flex flex-col">
          <div className="flex flex-1">
            <h1 className="text-sm font-semibold w-1/2 border-r border-gray-400 p-2 text-center">
              {formatCurrency(monthlyInterests?.totals?.contributionsBefore)}{" "}
              RWF
            </h1>
            <h1 className="text-sm font-semibold flex-1 p-2 text-center">
              {formatCurrency(monthlyInterests?.totals?.contributionsAfter)} RWF
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyInterests;
