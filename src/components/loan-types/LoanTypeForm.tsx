import React from "react";
import Input from "../reusable/Input";

type LoanType = {
  name: string;
  paymentMonths: number;
  interestRate: number;
};

type LoanTypeFormProps = {
  newLoanType: Partial<LoanType>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
};

const LoanTypeForm: React.FC<LoanTypeFormProps> = ({
  newLoanType,
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
          name="name"
          value={newLoanType.name || ""}
          onInputChange={onInputChange}
          label="Name"
        />
        <Input
          type="number"
          name="paymentMonths"
          value={newLoanType.paymentMonths || ""}
          onInputChange={onInputChange}
          label="Payment Months"
        />
        <Input
          type="number"
          name="interestRate"
          value={newLoanType.interestRate || ""}
          onInputChange={onInputChange}
          label="Interest Rate"
        />
        {Boolean(newLoanType.interestRate) && (
          <p className="text-sm text-gray-600">
            Percentage: {(newLoanType.interestRate || 0) * 100}%
          </p>
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

export default LoanTypeForm;
