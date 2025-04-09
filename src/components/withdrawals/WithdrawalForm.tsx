/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import Input from "../reusable/Input";
import { Select } from "antd";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import { formatCurrency } from "../../utils/functions";
import toast from "react-hot-toast";

type Withdrawal = {
  id: string;
  userId: any;
  withdrawAmount: number;
  isRelatedToPartialExit: boolean;
  memberID: string;
};

type WithdrawalFormProps = {
  newWithdrawal: Partial<Withdrawal>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
  submitting: boolean;
};

type Option = {
  value: string;
  label: string;
  memberID: string;
};

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  newWithdrawal,
  onInputChange,
  onSave,
  submitting,
}) => {
  const [allowedBalance, setAllowedBalance] = React.useState<any>({});
  const [usersOptions, setUsersOptions] = React.useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      const response = await axiosInstance.get(url + "/users");
      const users = (response.data?.data || []).filter(
        (user: any) => !user.hasLeft && user.status === "ACTIVE"
      );
      setUsersOptions(
        users.map((user: any) => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
          memberID: user.memberID,
        }))
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!newWithdrawal.userId) {
        setAllowedBalance({});
        return;
      }
      const response = await axiosInstance.get(
        url +
          `/withdrawals/user/allowed-withdrawal-balance/${newWithdrawal.userId}`
      );
      const balance = response.data?.data || {};
      setAllowedBalance({
        userId: balance.id,
        amount: Math.floor(balance.allowedWithdrawalBalance),
      });
    })();
  }, [newWithdrawal.userId]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (
          (newWithdrawal?.withdrawAmount != undefined &&
            newWithdrawal?.withdrawAmount > allowedBalance.amount + 50000) ||
          (newWithdrawal.isRelatedToPartialExit &&
            allowedBalance.amount < 50000)
        ) {
          toast.error(
            "Amount exceeds allowed balance or insufficient balance for partial exit"
          );
          submitting = false;
          return;
        }
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
          value={newWithdrawal.userId || "Select Member"}
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

        {allowedBalance.userId === newWithdrawal.userId && (
          <p className="text-sm text-gray-500">
            Allowed Balance:{" "}
            {formatCurrency(
              Math.max(
                newWithdrawal.isRelatedToPartialExit
                  ? allowedBalance.amount
                  : allowedBalance.amount + 50000,
                0
              )
            )}{" "}
            RWF
          </p>
        )}

        <Input
          type="number"
          label="Withdraw Amount"
          name="withdrawAmount"
          value={newWithdrawal.withdrawAmount || ""}
          onInputChange={onInputChange}
        />

        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            id="isRelatedToPartialExit"
            name="isRelatedToPartialExit"
            checked={newWithdrawal.isRelatedToPartialExit || false}
            onChange={(e) => {
              onInputChange({
                target: {
                  name: "isRelatedToPartialExit",
                  value: e.target.checked,
                },
              } as any);
            }}
            className="mr-2"
          />
          <label
            htmlFor="isRelatedToPartialExit"
            className="text-sm font-semibold text-gray-600"
          >
            Is this related to a partial exit?
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Checking this box will adjust the allowed balance accordingly. If
          checked, the withdrawal will be related to a partial exit, and the
          account must contain at least 50,000 RWF after the withdrawal. If
          unchecked, an additional 50,000 RWF will be added to the allowed
          balance.
        </p>
      </div>

      <div className="flex justify-end mt-5">
        <button
          className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default WithdrawalForm;
