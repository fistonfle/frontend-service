import React from "react";
import Input from "../reusable/Input";

type Report = {
  name: string;
  date: string;
};

type ReportFormProps = {
  newReport: Partial<Report>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
  hideDate?: boolean;
};

const ReportForm: React.FC<ReportFormProps> = ({
  newReport,
  isSubmitting,
  onInputChange,
  onSave,
  hideDate,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <Input
          type="text"
          name="name"
          value={newReport.name || ""}
          onInputChange={onInputChange}
          label="Name"
        />
        {!hideDate && (
          <Input
            type="date"
            name="date"
            value={newReport.date || ""}
            onInputChange={onInputChange}
            label="Starting Date"
          />
        )}
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

export default ReportForm;
