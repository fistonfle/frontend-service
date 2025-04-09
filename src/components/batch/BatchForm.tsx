import React from "react";
import Input from "../reusable/Input";

type Batch = {
  date: string;
  status: string;
  closingDate: string;
};

type BatchFormProps = {
  newBatch: Partial<Batch>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
};

const BatchForm: React.FC<BatchFormProps> = ({
  newBatch,
  isSubmitting,
  onInputChange,
  onSave,
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
          type="date"
          name="date"
          value={newBatch.date || ""}
          onInputChange={onInputChange}
          label="Starting Date"
        />
        <Input
          type="date"
          name="closingDate"
          value={newBatch.closingDate || ""}
          onInputChange={onInputChange}
          label="Closing Date"
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

export default BatchForm;
