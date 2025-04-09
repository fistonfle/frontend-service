/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import readXlsxFile from "read-excel-file";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { handleApiError } from "../utils/handleApiError";
import { AppContext } from "../context/AppContext";

const ImportDataPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>([]);
  const [file, setFile] = useState<any>(null);

  const { handleLogout } = React.useContext(AppContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsSubmitting(true);
    try {
      const rows = await readXlsxFile(file);
      setData(rows);
    } catch (error) {
      toast.error("Error importing data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitToServer = async () => {
    try {
      setIsSubmitting(true);
      const formatRow = (row: any) => {
        let newRow = row instanceof Date ? row.toISOString() : String(row);
        if (newRow === "null") newRow = "";
        return newRow;
      };
      const formattedData = data.slice(1).map((row: any) => ({
        DATEREPORT: new Date().toISOString(),
        member_ID: row[0]?.replace(/^'/, ""),
        member_NAME: row[1]?.replace(/^'/, ""),
        email: row[2]?.replace(/^'/, ""),
        bankname: row[17]?.replace(/^'/, ""),
        banknumber: row[18]?.replace(/^'/, ""),
        contributions_MONTHLY: row[3]?.replace(/^'/, "")?.split(",").join(""),
        contributions_TOTAL: row[4]?.replace(/^'/, "")?.split(",").join(""),
        loans_COUNT: row[5]?.replace(/^'/, ""),
        loans_PRINCIPAL: row[7]?.replace(/^'/, "")?.split(",").join(""),
        dateloan:
          formatRow(row[6])?.replace(/^'/, "") === "N/A" ||
          !formatRow(row[6])?.replace(/^'/, "")?.trim()
            ? new Date()?.toISOString()
            : new Date(formatRow(row[6])?.replace(/^'/, "")).toISOString(),
        loans_REMAINING: row[8]?.replace(/^'/, "")?.split(",").join(""),
        loans_MONTHLY: row[9]?.replace(/^'/, "")?.split(",").join(""),
        payments_START: row[10]?.replace(/^'/, ""),
        payments_UPCOMMING: row[11]?.replace(/^'/, ""),
        payments_LAST: row[12]?.replace(/^'/, ""),
        executions_TOTAL: row[13]?.replace(/^'/, ""),
        executions_DONE: row[14]?.replace(/^'/, ""),
        executions_REMAINING: row[15]?.replace(/^'/, ""),
        balances: row[16]?.replace(/^'/, "")?.split(",").join(""),
      }));
      console.log(formattedData);
      const response = await axiosInstance.post(
        url + `/backup/import-loan-situation`,
        formattedData
      );
      if (response.data) {
        toast.success("Data imported successfully");
        // clear file input
        setFile(null);
        setData([]);
      }
    } catch (error: any) {
      handleApiError(error, handleLogout);
      toast.error(
        (error?.response?.data?.message || "Error importing data")?.split(
          ","
        )[0]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCard = (row: any[], index: number) => (
    <div key={index} className="bg-white rounded-xl p-4 shadow-md">
      <p className="font-bold mb-2 underline">Member Number {index + 1}</p>
      {row.map((cell: any, cellIndex: number) => (
        <p key={cellIndex}>
          <span className="font-bold text-sm">{data[0][cellIndex]}: </span>
          {cell instanceof Date ? cell.toISOString() : String(cell)}
        </p>
      ))}
    </div>
  );

  const memoizedData = useMemo(() => data, [data]);

  return (
    <MainLayout title="Import Data" hideNewButton={true} hideFilters>
      <div className="mt-10">
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="file" className="text-sm font-semibold">
            Select File
          </label>
          <input
            type="file"
            name="file"
            id="file"
            className="border border-gray-300 rounded-md p-1"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
            onClick={handleImport}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Import"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {memoizedData
            .slice(1)
            .map((row: any[], index: number) => renderCard(row, index))}
        </div>
        {memoizedData.length > 1 && (
          <div className="mt-4">
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              onClick={submitToServer}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Send to server"}
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ImportDataPage;
