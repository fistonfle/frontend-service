/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import Input from "../reusable/Input";
import { Select } from "antd";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";

type Saving = {
  id: string;
  report: any;
  reportId: any;
  user: any;
  userId: any;
  savingAmount: number;
};

type SavingFormProps = {
  newSaving: Partial<Saving>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
};

type Option = {
  value: string;
  label: string;
};

const SavingForm: React.FC<SavingFormProps> = ({
  newSaving,
  onInputChange,
  onSave,
  isSubmitting,
}) => {
  const [usersOptions, setUsersOptions] = React.useState<Option[]>([]);
  const [reportsOptions, setReportsOptions] = React.useState<Option[]>([]);
  useEffect(() => {
    (async () => {
      const response = await axiosInstance.get(url + "/users");
      const users = (response.data?.data || []).filter(
        (user: any) =>
          !user.hasLeft &&
          !user.hasStoppedContributing &&
          user.status === "ACTIVE"
      );
      setUsersOptions(
        users.map((user: any) => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
        }))
      );

      const response2 = await axiosInstance.get(url + "/reports");
      const reports = response2.data?.data || [];
      setReportsOptions(
        reports.map((report: any) => ({
          value: report.id,
          label: report.name,
        }))
      );
    })();
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <label
          htmlFor="reportId"
          className="text-sm font-semibold text-gray-600"
        >
          Report Name
        </label>
        <Select
          id="reportId"
          className="w-full"
          placeholder="Select Report"
          options={reportsOptions}
          value={newSaving.reportId || "Select Report"}
          onChange={(value) => {
            onInputChange({
              target: {
                name: "reportId",
                value,
              },
            } as any);
          }}
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label || "")
              ?.toLowerCase()
              ?.indexOf(input.toLowerCase()) >= 0
          }
        />
        <label htmlFor="userId" className="text-sm font-semibold text-gray-600">
          Member
        </label>
        <Select
          id="userId"
          className="w-full"
          placeholder="Select Member"
          options={usersOptions}
          value={newSaving.userId || "Select Member"}
          onChange={(value) => {
            onInputChange({
              target: {
                name: "userId",
                value,
              },
            } as any);
          }}
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label || "")
              ?.toLowerCase()
              ?.indexOf(input.toLowerCase()) >= 0
          }
        />
        <Input
          type="number"
          label="Saving Amount"
          name="savingAmount"
          value={newSaving.savingAmount || ""}
          onInputChange={onInputChange}
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default SavingForm;
