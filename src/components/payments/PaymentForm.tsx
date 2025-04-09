/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import Input from "../reusable/Input";
import { Select } from "antd";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type Payment = {
  paymentDate: string;
  userId: string;
  loanId: string;
  paidAmount: number;
  reportId: string;
  paymentMonths: number;
};

type PaymentFormProps = {
  newPayment: Partial<Payment>;
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (deductFromSavings: boolean) => void;
  onClose: () => void;
};

type Option = {
  value: string;
  label: string;
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  newPayment,
  isSubmitting,
  onInputChange,
  onSave,
}) => {
  const [usersOptions, setUsersOptions] = React.useState<Option[]>([]);
  const [reportsOptions, setReportsOptions] = React.useState<Option[]>([]);
  const [loansOptions, setLoansOptions] = React.useState<Option[]>([]);
  const [remainingBalance, setRemainingBalance] = React.useState({
    loanId: "",
    amount: 0,
  });
  const [deductFromSavings, setDeductFromSavings] = React.useState(false);
  const { handleLogout } = React.useContext(AppContext);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/users");
        const users = (response.data?.data || []).filter(
          (user: any) => user.status !== "PENDING"
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
      } catch (error: any) {
        handleApiError(error, handleLogout);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoansOptions([]);
        setRemainingBalance({
          loanId: "",
          amount: 0,
        });
        onInputChange({
          target: {
            name: "loanId",
            value: "",
          },
        } as any);
        if (!newPayment.userId) return;
        const response = await axiosInstance.get(
          url + "/loans/by-user/" + newPayment.userId
        );
        const loans = (response.data?.data || [])?.filter(
          (loan: any) => loan.status !== "PAID"
        );
        setLoansOptions(
          loans.map((loan: any) => ({
            value: loan.id,
            label: `${formatCurrency(loan.amount)} RWF (${
              loan.loanType.name || loan.loanType.paymentMonths + " months"
            })`,
          }))
        );
      } catch (error: any) {
        handleApiError(error, handleLogout);
      }
    })();
  }, [newPayment.userId]);

  useEffect(() => {
    (async () => {
      try {
        if (newPayment.loanId !== remainingBalance.loanId) {
          setRemainingBalance({
            loanId: "",
            amount: 0,
          });
        }
        if (newPayment.loanId) {
          const response = await axiosInstance.get(
            url + "/loans/remaining-payment-amount/" + newPayment.loanId
          );
          const loanRemaining = response.data?.data || {};
          setRemainingBalance({
            loanId: loanRemaining.id,
            amount: loanRemaining.remainingPaymentAmount,
          });
        }
      } catch (error: any) {
        handleApiError(error, handleLogout);
      }
    })();
  }, [newPayment.loanId]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(deductFromSavings);
      }}
      className="space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <label
          htmlFor="reportId"
          className="text-sm font-semibold text-gray-600"
        >
          Report
        </label>
        <Select
          id="reportId"
          className="w-full"
          placeholder="Select Report"
          options={reportsOptions}
          value={newPayment.reportId || "Select Report"}
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
          value={newPayment.userId || "Select Member"}
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
        <label htmlFor="loanId" className="text-sm font-semibold text-gray-600">
          Loan
        </label>
        <Select
          id="loanId"
          className="w-full"
          placeholder="Select Loan"
          options={loansOptions}
          value={newPayment.loanId || "Select Loan"}
          onChange={(value) => {
            onInputChange({
              target: {
                name: "loanId",
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
        {remainingBalance.loanId === newPayment.loanId &&
          remainingBalance.loanId && (
            <p className="text-sm text-gray-500">
              Remaining Balance: {formatCurrency(remainingBalance.amount)} RWF
            </p>
          )}
        <Input
          type="number"
          label="Paid Amount"
          name="paidAmount"
          value={newPayment.paidAmount || ""}
          onInputChange={onInputChange}
        />
        <Input
          type="date"
          label="Payment Date"
          name="paymentDate"
          value={newPayment.paymentDate || ""}
          onInputChange={onInputChange}
        />
        <p className="text-sm text-gray-500 pt-4">
          Making a manual payment will automatically reschedule the loan. Please
          fill in the payment months for the remaining balance after this
          payment.
        </p>
        <Input
          type="number"
          label="Payment Months"
          name="paymentMonths"
          value={newPayment.paymentMonths || ""}
          onInputChange={onInputChange}
        />

        <div className="flex items-center pt-4">
          <input
            type="checkbox"
            id="deductFromSavings"
            name="deductFromSavings"
            checked={deductFromSavings}
            onChange={(e) => {
              onInputChange({
                target: {
                  name: "deductFromSavings",
                  value: e.target.checked,
                },
              } as any);
              setDeductFromSavings(e.target.checked);
            }}
            className="mr-2"
          />
          <label htmlFor="deductFromSavings" className="text-sm text-gray-600">
            Deduct from savings
          </label>
          <p className="text-sm text-gray-500 ml-2">
            (Checking this will deduct the payment amount from the member's
            savings account balance.)
          </p>
        </div>
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

export default PaymentForm;
