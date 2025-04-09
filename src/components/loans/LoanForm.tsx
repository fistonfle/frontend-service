/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import Input from "../reusable/Input";
import { Select } from "antd";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type Loan = {
  date: string;
  startPaymentDate: string;
  loanTypeId: string;
  amount: number;
  reportId: string;
  userId: string;
  customPaymentMonths: number;
  memberID: string;
};

type LoanFormProps = {
  newLoan: Partial<Loan>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
};

type Option = {
  value: string;
  label: string;
  name: string;
  memberID: string;
};

const LoanForm: React.FC<LoanFormProps> = ({
  newLoan,
  isSubmitting,
  onInputChange,
  onSave,
}) => {
  const [usersOptions, setUsersOptions] = React.useState<Option[]>([]);
  const [loanTypesOptions, setLoanTypesOptions] = React.useState<Option[]>([]);
  const [selectedLoanType, setSelectedLoanType] = React.useState("");
  const [allowedBalance, setAllowedBalance] = React.useState({
    userId: "",
    amount: 0,
  });
  const { handleLogout } = React.useContext(AppContext);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/users");
        const users = (response.data?.data || [])?.filter(
          (user: any) => !user.hasLeft && user.status === "ACTIVE"
        );
        setUsersOptions(
          users.map((user: any) => ({
            value: user.id,
            label: `${user.firstname} ${user.lastname}`,
            memberID: user.memberID,
          }))
        );

        const response2 = await axiosInstance.get(url + "/loan-types");
        const loanTypes = response2.data?.data || [];
        setLoanTypesOptions(
          loanTypes.map((loanType: any) => ({
            value: loanType.id,
            label: loanType.name + " (" + loanType.paymentMonths + " months)",
            name: loanType.name,
          }))
        );
      } catch (error: any) {
        handleApiError(error, handleLogout);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (newLoan?.userId) {
        const overdraftLoan = loanTypesOptions.find((loanType) =>
          loanType.name.includes("Overdraft")
        );

        const response =
          selectedLoanType === overdraftLoan?.value
            ? await axiosInstance.get(
                url + "/loans/allowed-overdraft/" + newLoan.userId
              )
            : await axiosInstance.get(
                url + "/loans/allowed-balance/" + newLoan.userId
              );
        const userBalance = response.data?.data || {};
        setAllowedBalance({
          userId: userBalance.id,
          amount: Math.floor(userBalance.allowedBalance),
        });
      }
    })();
  }, [newLoan.userId, selectedLoanType]);

  useEffect(() => {
    (async () => {
      try {
        if (newLoan.userId) {
          const response = await axiosInstance.get(
            url + "/loans/allowed-balance/" + newLoan.userId
          );
          const userBalance = response.data?.data || {};
          setAllowedBalance({
            userId: userBalance.id,
            amount: userBalance.allowedBalance,
          });
        }
      } catch (error: any) {
        handleApiError(error, handleLogout);
      }
    })();
  }, [newLoan.userId]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <label htmlFor="userId" className="text-sm font-semibold text-gray-600">
          Member
        </label>
        <Select
          id="userId"
          className="w-full"
          placeholder="Select Member"
          options={usersOptions}
          value={newLoan.userId || "Select Member"}
          onChange={(value) => {
            onInputChange({
              target: {
                name: "userId",
                value,
              },
            } as any);

            onInputChange({
              target: {
                name: "memberID",
                value: usersOptions.find((user) => user.value === value)
                  ?.memberID,
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
        <label
          htmlFor="loanTypeId"
          className="text-sm font-semibold text-gray-600"
        >
          Loan Type
        </label>
        <Select
          id="loanTypeId"
          className="w-full"
          placeholder="Select Loan Type"
          options={loanTypesOptions}
          value={newLoan.loanTypeId || "Select Loan Type"}
          onChange={(value) => {
            onInputChange({
              target: {
                name: "loanTypeId",
                value,
              },
            } as any);
            setSelectedLoanType(value);
          }}
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label || "")
              ?.toLowerCase()
              ?.indexOf(input.toLowerCase()) >= 0
          }
        />
        {allowedBalance.userId === newLoan.userId && newLoan.loanTypeId && (
          <p className="text-sm text-gray-500">
            Allowed Balance:{" "}
            {formatCurrency(Math.max(allowedBalance.amount, 0))} RWF
          </p>
        )}
        <Input
          type="number"
          label="Loan Amount"
          name="amount"
          value={newLoan.amount || ""}
          onInputChange={onInputChange}
        />
        <Input
          type="date"
          label="Start Payment Date"
          name="startPaymentDate"
          value={newLoan.startPaymentDate || ""}
          onInputChange={onInputChange}
        />
        <Input
          type="number"
          label="Custom Payment Months"
          name="customPaymentMonths"
          value={newLoan.customPaymentMonths || ""}
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

export default LoanForm;
