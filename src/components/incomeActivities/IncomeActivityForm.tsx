/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type IncomeActivity = {
  date: string;
  activity: string;
  amount: number;
  bankCharges: number;
  description: string;
  bondStartDate: string;
  bondEndDate: string;
};

type IncomeActivityFormProps = {
  newIncomeActivity: Partial<IncomeActivity>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (isBond: boolean) => void;
  onClose: () => void;
};

const IncomeActivityForm: React.FC<IncomeActivityFormProps> = ({
  newIncomeActivity,
  isSubmitting,
  onInputChange,
  onSave,
}) => {
  const [isBond, setIsBond] = React.useState(false);
  const [reports, setReports] = React.useState([] as any);
  const { handleLogout } = React.useContext(AppContext);

  useEffect(() => {
    try {
      setReports([]);
      (async () => {
        if (!newIncomeActivity.bondStartDate || !newIncomeActivity.bondEndDate)
          return;
        const response = await axiosInstance.get(
          url +
            `/reports/between-dates?startDate=${newIncomeActivity.bondStartDate}&endDate=${newIncomeActivity.bondEndDate}`
        );
        setReports(response.data?.data);
      })();
    } catch (error) {
      handleApiError(error, handleLogout);
      setReports([]);
    }
  }, [newIncomeActivity.bondStartDate, newIncomeActivity.bondEndDate]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(isBond);
      }}
      className="space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="activity"
            className="text-sm font-semibold text-gray-600"
          >
            Activity Name
          </label>
          <input
            type="text"
            name="activity"
            id="activity"
            value={newIncomeActivity.activity}
            onChange={onInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="amount"
            className="text-sm font-semibold text-gray-600"
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={newIncomeActivity.amount}
            onChange={onInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="bankCharges"
            className="text-sm font-semibold text-gray-600"
          >
            Bank Charges
          </label>
          <input
            type="number"
            name="bankCharges"
            id="bankCharges"
            value={newIncomeActivity.bankCharges}
            onChange={onInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-gray-600"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={newIncomeActivity.description}
            onChange={onInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1">
          <input
            type="checkbox"
            name="isBond"
            id="isBond"
            checked={isBond}
            onChange={(e) => setIsBond(e.target.checked)}
            className="rounded-sm"
          />
          <label
            htmlFor="isBond"
            className="text-sm font-semibold text-gray-600"
          >
            Is Bond (Distributed over a number of months)
          </label>
        </div>

        {isBond && (
          <div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="bondStartDate"
                className="text-sm font-semibold text-gray-600"
              >
                Start Date
              </label>
              <input
                type="date"
                name="bondStartDate"
                id="bondStartDate"
                value={newIncomeActivity.bondStartDate || ""}
                onChange={onInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                required={isBond}
              />
            </div>
            <div className="flex flex-col space-y-1 mt-4">
              <label
                htmlFor="bondEndDate"
                className="text-sm font-semibold text-gray-600"
              >
                End Date
              </label>
              <input
                type="date"
                name="bondEndDate"
                id="bondEndDate"
                value={newIncomeActivity.bondEndDate || ""}
                onChange={onInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                required={isBond}
              />
            </div>
            {reports.length > 0 && (
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-600">
                  {reports.length} Report(s) between the selected dates
                </h3>
                <ul className="space-y-2 mt-2 list-disc pl-5">
                  {reports.map((report: any) => (
                    <li key={report.id} className="text-sm">
                      {report.name} at {report.date}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Requesting..." : "Request Income Saving"}
        </button>
      </div>
    </form>
  );
};

export default IncomeActivityForm;
