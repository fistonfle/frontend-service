/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../../utils/functions";

type Props = {
  monthlyLoanRecovery: any;
};

const MonthlyLoanRecovery = ({ monthlyLoanRecovery = {} }: Props) => {
  return (
    <div className="w-full mt-40">
      <h1 className="text-2xl font-medium text-center mb-10">
        COMPASSION SAVE TO SERVE GROUP
      </h1>
      <div className="border-b border-gray-400 flex items-center justify-center gap-4 pb-4">
        <h1 className="text-xl font-bold text-center mb-2">
          LOANS, MONTHLY RECOVERY:
        </h1>
        <h1 className="text-xl font-bold text-center mb-2">
          {formatCurrency(monthlyLoanRecovery.month)} RWF
        </h1>
      </div>

      {/*  */}
      <div className="flex border border-gray-400 mt-4">
        <div className="w-[30%] border-r border-gray-400">
          <h1 className="text-md font-semibold text-left py-2 px-10">MEMBER</h1>
          <div className="flex border-t border-gray-400 justify-center items-center">
            <h1 className="text-sm font-semibold w-1/6 border-r border-gray-400 p-2">
              ID #
            </h1>
            <h1 className="text-sm font-semibold flex-1 pl-4">ALL NAMES</h1>
          </div>
        </div>
        <div className="w-[20%] border-r border-gray-400 flex flex-col">
          <h1 className="text-md font-semibold text-left py-2 pl-4">
            CURRENT LOAN
          </h1>
          <div className="flex border-t border-gray-400 flex-1">
            <h1 className="text-sm font-semibold w-1/2 border-r border-gray-400 p-2">
              ID
            </h1>
            <h1 className="text-sm font-semibold flex-1 pl-4">PERIOD</h1>
          </div>
        </div>
        <div className="w-[50%]">
          <h1 className="text-md font-semibold text-left py-2 px-10">
            LOAN PAYMENT INFORMATIONS
          </h1>
          <div className="flex border-t border-gray-400">
            <h1 className="text-sm font-semibold w-1/4 border-r border-gray-400 p-2">
              PRINCIPAL
            </h1>
            <h1 className="text-sm font-semibold w-1/4 border-r border-gray-400 p-2">
              INTERESTS
            </h1>
            <h1 className="text-sm font-semibold w-1/4 border-r border-gray-400 p-2">
              MONTHLY
            </h1>
            <h1 className="text-sm font-semibold w-1/4 p-2">REMAINING LOAN</h1>
          </div>
        </div>
      </div>

      {/* loan recovery data */}
      {monthlyLoanRecovery?.loansRecovery?.map((loan: any, index: number) => (
        <div key={index} className="flex border-b border-x border-gray-400">
          <div className="w-[30%] border-r border-gray-400">
            <div className="flex justify-center items-center">
              <h1 className="text-sm font-normal w-1/6 border-r border-gray-400 p-2">
                {loan.memberID}
              </h1>
              <h1 className="text-sm font-normal flex-1 pl-4">{loan.names}</h1>
            </div>
          </div>
          <div className="w-[20%] border-r border-gray-400">
            <div className="flex h-full">
              <h1 className="text-sm font-normal w-1/2 border-r border-gray-400 p-2">
                {loan.currentLoan?.loanId}
              </h1>
              <h1 className="text-sm font-normal flex-1 pl-4 m-auto">
                {loan.currentLoan?.loanPaidPeriods}
              </h1>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="flex justify-center items-center">
              <h1 className="text-sm font-light w-1/4 border-r border-gray-400 p-2">
                {formatCurrency(loan.payments?.principalLoan)} RWF
              </h1>
              <h1 className="text-sm font-light w-1/4 border-r border-gray-400 p-2">
                {formatCurrency(loan.payments?.interests)} RWF
              </h1>
              <h1 className="text-sm font-light w-1/4 border-r border-gray-400 p-2">
                {formatCurrency(loan.payments?.monthly)} RWF
              </h1>
              <h1 className="text-sm font-light w-1/4 p-2">
                {formatCurrency(loan.payments?.remaining)} RWF
              </h1>
            </div>
          </div>
        </div>
      ))}

      {/* totals */}
      <div className="flex border border-gray-400 border-t-0">
        <div className="w-[50%] border-r border-gray-400">
          <h1 className="text-md font-semibold text-center py-2 px-10">
            {"T O T A L S =====>>>>"}
          </h1>
        </div>
        <div className="w-[50%] flex justify-center items-center">
          <h1 className="text-sm font-semibold text-left py-2 px-2 w-1/4 border-r border-gray-400">
            {formatCurrency(monthlyLoanRecovery?.totals?.principalLoan)} RWF
          </h1>
          <h1 className="text-sm font-semibold text-left py-2 px-4 w-1/4 border-r border-gray-400">
            {formatCurrency(monthlyLoanRecovery?.totals?.interests)} RWF
          </h1>
          <h1 className="text-sm font-semibold text-left py-2 px-4 w-1/4 border-r border-gray-400">
            {formatCurrency(monthlyLoanRecovery?.totals?.monthly)} RWF
          </h1>
          <h1 className="text-sm font-semibold text-left py-2 px-4 w-1/4 border-r border-gray-400">
            {formatCurrency(monthlyLoanRecovery?.totals?.remaining)} RWF
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLoanRecovery;
