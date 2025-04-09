/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../../utils/functions";

type Props = {
  allStatementComparison: any;
};

const AllStatementComparison = ({ allStatementComparison = {} }: Props) => {
  return (
    <div className="w-full mb-40">
      <h1 className="text-2xl font-medium text-center mb-10">
        COMPASSION SAVE TO SERVE GROUP
      </h1>
      <div className="border-b border-gray-400 flex items-center justify-center gap-4 pb-4">
        <h1 className="text-xl font-bold text-center mb-2">
          COMPARISON: BALANCES AND STATEMENT{" "}
        </h1>
        <h1 className="text-xl font-bold text-center mb-2">
          {allStatementComparison.generatedAt}
        </h1>
      </div>

      {/* headers */}
      <div className="flex border border-gray-400 mt-4">
        <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-md font-semibold text-center py-2 px-1 m-auto">
            NUMBER
          </h1>
        </div>
        <div className="w-[20%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto">
            MEMBER NAMES
          </h1>
        </div>
        <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto">
            CONTRIBUTIONS
          </h1>
        </div>
        <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto">
            TOTAL LOANS
          </h1>
        </div>
        <div className="w-[30%] border-r border-gray-400 flex flex-col">
          <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto">
            FIGURES COMPARISONS
          </h1>
          <div className="flex-1 flex border-t border-gray-400">
            <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto w-[50%] border-r border-gray-400">
              BALANCE
            </h1>
            <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto w-[50%]">
              STATEMENT
            </h1>
          </div>
        </div>
        <div className="w-[20%] flex items-center justify-center">
          <h1 className="text-sm font-semibold text-center py-2 px-1 m-auto">
            BAL - STAT
          </h1>
        </div>
      </div>

      {/* data */}
      {allStatementComparison?.allStatements?.map(
        (statement: any, index: number) => (
          <div key={index} className="flex border-b border-x border-gray-400">
            <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
              <h1 className="text-xs font-normal text-center py-2 px-1 m-auto">
                {statement.memberID}
              </h1>
            </div>
            <div className="w-[20%] border-r border-gray-400 flex items-center justify-center">
              <h1 className="text-xs font-normal text-center py-2 px-1 m-auto">
                {statement.names}
              </h1>
            </div>
            <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
              <h1 className="text-xs font-normal text-center py-2 px-1 m-auto">
                {formatCurrency(statement.contributions)} RWF
              </h1>
            </div>
            <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
              <h1 className="text-xs font-normal text-center py-2 px-1 m-auto">
                {formatCurrency(statement.totalLoans)} RWF
              </h1>
            </div>
            <div className="w-[30%] border-r border-gray-400 flex flex-col">
              <div className="flex-1 flex">
                <h1 className="text-xs font-normal text-center py-2 px-1 m-auto w-[50%] border-r border-gray-400">
                  {formatCurrency(statement.balance)} RWF
                </h1>
                <h1 className="text-xs font-normal text-center py-2 px-1 m-auto w-[50%]">
                  {formatCurrency(statement.statement)} RWF
                </h1>
              </div>
            </div>
            <div className="w-[20%] flex items-center justify-center">
              <h1 className="text-xs font-normal text-center py-2 px-1 m-auto">
                {formatCurrency(statement.balance - statement.statement)} RWF
              </h1>
            </div>
          </div>
        )
      )}

      {/* totals */}
      <div className="flex border-b border-x border-gray-400">
        <div className="w-[30%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-md font-semibold text-center py-2 px-1 m-auto">
            TOTALS
          </h1>
        </div>
        <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-xs font-semibold text-center py-2 px-1 m-auto">
            {formatCurrency(allStatementComparison?.totalContributions)} RWF
          </h1>
        </div>
        <div className="w-[10%] border-r border-gray-400 flex items-center justify-center">
          <h1 className="text-xs font-semibold text-center py-2 px-1 m-auto">
            {formatCurrency(allStatementComparison?.totalLoans)} RWF
          </h1>
        </div>
        <div className="w-[30%] border-r border-gray-400 flex flex-col">
          <div className="flex-1 flex">
            <h1 className="text-xs font-semibold text-center py-2 px-1 m-auto w-[50%] border-r border-gray-400">
              {formatCurrency(allStatementComparison?.totalBalance)} RWF
            </h1>
            <h1 className="text-xs font-semibold text-center py-2 px-1 m-auto w-[50%]">
              {formatCurrency(allStatementComparison?.totalStatement)} RWF
            </h1>
          </div>
        </div>
        <div className="w-[20%] flex items-center justify-center">
          <h1 className="text-xs font-semibold text-center py-2 px-1 m-auto">
            {formatCurrency(allStatementComparison?.totalStatementMinusBalance)}{" "}
            RWF
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AllStatementComparison;
