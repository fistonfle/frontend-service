/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatCurrency } from "../../../utils/functions";

type Props = {
  accountingSummary: any;
};

const AccountingSummary = ({ accountingSummary = {} }: Props) => {
  return (
    <div className="w-full mb-40">
      <h1 className="text-2xl font-medium text-center mb-10">
        COMPASSION SAVE TO SERVE GROUP
      </h1>
      <div className="border-b border-gray-400 flex items-center justify-center gap-4 pb-4">
        <h1 className="text-xl font-bold text-center mb-2">
          MONTHLY ----ACCOUNTING --- S U M M A R Y ---
        </h1>
        <h1 className="text-xl font-bold text-center mb-2">
          {accountingSummary.month}
        </h1>
      </div>

      {/* headers */}
      <div className="flex border border-gray-400 mt-4 mb-2">
        <div className="w-[35%] flex flex-col border-r border-gray-400">
          <h1 className="text-md font-semibold text-center py-2 px-10">
            MEMBER'S INFORMATIONS
          </h1>
          <div className="flex justify-between items-center px-10 border-t border-gray-400 flex-1">
            <h1 className="text-sm font-semibold w-1/6 border-r border-gray-400 p-2 h-full flex items-center">
              ID #
            </h1>
            <h1 className="text-sm text-center font-semibold flex-1 pl-4">
              ALL Names
            </h1>
          </div>
        </div>
        <div className="w-[50%] flex flex-col border-r border-gray-400">
          <h1 className="text-md font-semibold text-center py-2 px-10">
            ALL MONTHLY WITHDRAWS, ----D E T A I L S ----{" "}
          </h1>
          <div className="flex justify-between items-center border-t border-gray-400">
            <div className="w-1/5 border-r border-gray-400 h-full flex items-center justify-center">
              <h1 className="text-sm font-semibold p-2">CONTRIBUTION</h1>
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className="text-sm font-semibold border-b border-gray-400 p-2 text-center">
                LOANS DETAILS
              </h1>
              <div className="flex justify-between items-center">
                <h1 className="text-sm font-semibold w-1/3 border-r border-gray-400 p-2">
                  PRINC. LOAN
                </h1>
                <h1 className="text-sm font-semibold w-1/3 border-r border-gray-400 p-2">
                  INT. LOAN
                </h1>
                <h1 className="text-sm font-semibold flex-1 pl-4">
                  TOT. LOANS
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[15%]">
          <h1 className="text-md font-semibold text-center py-2 px-4">
            ALL WITHDRAWS (TOTAL)
          </h1>
        </div>
      </div>

      {/* members */}
      {accountingSummary?.members?.map((member: any, index: number) => (
        <div
          key={index}
          className={`flex border border-gray-400 ${
            index > 0 ? "border-t-0" : ""
          }`}
        >
          <div className="w-[35%] flex flex-col border-r border-gray-400">
            <div className="flex justify-between items-center px-10">
              <h1 className="text-sm font-normal w-1/6 border-r border-gray-400 p-2">
                {member.memberID}
              </h1>
              <h1 className="text-sm font-normal flex-1 pl-4">
                {member.names}
              </h1>
            </div>
          </div>
          <div className="w-[50%] flex flex-col border-r border-gray-400">
            <div className="flex justify-between items-center h-full">
              <div className="w-1/5 border-r border-gray-400 h-full flex items-center justify-center">
                <h1 className="text-sm font-light p-2">
                  {formatCurrency(member.contributions)} RWF
                </h1>
              </div>
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center border-gray-400">
                  <h1 className="text-sm font-light w-1/3 p-2 border-r border-gray-400">
                    {formatCurrency(member.principalLoan)} RWF
                  </h1>
                  <h1 className="text-sm font-light w-1/3 border-r border-gray-400 p-2">
                    {formatCurrency(member.interestPaid)} RWF
                  </h1>
                  <h1 className="text-sm font-light flex-1 pl-4">
                    {formatCurrency(member.loansRecovery)} RWF
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[15%]">
            <h1 className="text-md font-light text-center py-2 px-4">
              {formatCurrency(member.allWithdrawals)} RWF
            </h1>
          </div>
        </div>
      ))}

      {/* totals */}
      <div className="flex border border-gray-400 border-t-0">
        <div className="w-[35%] flex flex-col border-r border-gray-400">
          <h1 className="text-md font-semibold text-center py-2 px-10">
            {"T O T A L S / S U M M A R Y ======>>>>"}
          </h1>
        </div>
        <div className="w-[50%] flex flex-col border-r border-gray-400">
          <div className="flex justify-between items-center h-full">
            <div className="w-1/5 border-r border-gray-400 h-full flex items-center justify-center">
              <h1 className="text-sm font-semibold p-2">
                {formatCurrency(accountingSummary?.monthlyTotalContributions)}{" "}
                RWF
              </h1>
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex">
                <h1 className="text-sm font-semibold w-1/3 p-2 border-r border-gray-400 h-full">
                  {formatCurrency(accountingSummary?.monthlyTotalPrincipalLoan)}{" "}
                  RWF
                </h1>
                <h1 className="text-sm font-semibold w-1/3 border-r border-gray-400 p-2">
                  {formatCurrency(accountingSummary?.monthlyTotalInterestPaid)}{" "}
                  RWF
                </h1>
                <h1 className="text-sm font-semibold w-1/3 p-2">
                  {formatCurrency(accountingSummary?.monthlyTotalLoansRecovery)}{" "}
                  RWF
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[15%]">
          <h1 className="text-md font-semibold text-center py-2 px-4">
            {formatCurrency(accountingSummary?.monthlyTotalAllWithdrawals)} RWF
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AccountingSummary;
