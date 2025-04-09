import React from "react";
import Input from "../reusable/Input";

type Cashbook = {
  description: string;
  credit: number;
  debit: number;
};

type CashbookFormProps = {
  newCashbook: Partial<Cashbook>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
};

const CashbookForm: React.FC<CashbookFormProps> = ({
  newCashbook,
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
          type="text"
          label="Activity Description"
          name="description"
          value={newCashbook.description || ""}
          onInputChange={onInputChange}
        />
        <Input
          type="number"
          label="Debit (Outgoing Cash)"
          name="credit"
          value={newCashbook.credit || ""}
          onInputChange={onInputChange}
        />
        <Input
          type="number"
          label="Credit (Incoming Cash)"
          name="debit"
          value={newCashbook.debit || ""}
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

export default CashbookForm;
