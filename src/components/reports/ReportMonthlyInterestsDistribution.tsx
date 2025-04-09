/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import Input from "../reusable/Input";
import axiosInstance from "../../helpers/axios";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type ReportMonthlyInterestsDistributionProps = {
  reportId: string;
  onClose: () => void;
};

const ReportMonthlyInterestsDistribution: React.FC<
  ReportMonthlyInterestsDistributionProps
> = ({ reportId, onClose }) => {
  const [reportInterestsInfo, setReportInterestsInfo] = React.useState<any>({});
  const [bankCharges, setBankCharges] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { handleLogout } = React.useContext(AppContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBankCharges(Number(value));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      if (!reportId) {
        toast.error("Report not found");
        return;
      }
      const response = await axiosInstance.post(
        `/reports/${reportId}/distribute-interests`,
        {
          bankCharges,
        }
      );
      if (response.data) {
        toast.success("Interests successfully distributed");
        onClose();
      }
    } catch (error: any) {
      handleApiError(error, handleLogout);
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!reportId) {
      setReportInterestsInfo({});
      return;
    }
    axiosInstance
      .get(`/reports/${reportId}/calculate-interests-distribution`)
      .then((response) => {
        console.log(response.data.data);
        setReportInterestsInfo(response.data.data || {});
      })
      .catch((error) => {
        handleApiError(error, handleLogout);
        console.log(error);
      });
  }, [reportId]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-5"
    >
      {reportInterestsInfo?.totalMonthlyInterests ? (
        <p className="text-gray-700">
          Total Monthly Interests:{" "}
          {formatCurrency(reportInterestsInfo?.totalMonthlyInterests || 0)} RWF
        </p>
      ) : (
        <p className="text-gray-700">
          No monthly interests for{" "}
          {reportInterestsInfo?.reportInfo?.name || "this report"}
        </p>
      )}
      {reportInterestsInfo?.incomeActivity ? (
        <p className="text-gray-700">
          Monthly Interests has already been distributed
        </p>
      ) : (
        <>
          <div className="flex flex-col space-y-3">
            <Input
              type="number"
              name="bankCharges"
              value={bankCharges}
              onInputChange={handleInputChange}
              label="Bank Charges"
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Distributing..." : "Distribute"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default ReportMonthlyInterestsDistribution;
