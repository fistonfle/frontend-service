/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axiosInstance from "../../../helpers/axios";
import url from "../../../helpers/url";
import toast from "react-hot-toast";
import { formatCurrency } from "../../../utils/functions";
import { AppContext } from "../../../context/AppContext";
import { handleApiError } from "../../../utils/handleApiError";
import { Select } from "antd";

type SavingRow = {
  id: string;
  user: any;
  savingType: string;
  savingAmount: number;
  paidAmount?: number;
  paymentStatus?: "PAID" | "UNPAID";
};

export default function MonthlySavingsStatus({ reportId }: { reportId: string }) {
  const [rows, setRows] = React.useState<SavingRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showUnpaidOnly, setShowUnpaidOnly] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // quick payment (multiple months)
  const [selectedUserId, setSelectedUserId] = React.useState<string | undefined>(
    undefined
  );
  const [amount, setAmount] = React.useState<number>(0);
  const [paying, setPaying] = React.useState(false);

  const { handleLogout } = React.useContext(AppContext);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(url + `/savings/by-report/${reportId}`);
      const data = (res.data?.data || []) as SavingRow[];
      // only show monthly savings due entries
      setRows(data.filter((r) => r.savingType === "FROM_MONTHLY_REPORT"));
    } catch (e: any) {
      handleApiError(e, handleLogout);
      toast.error(e.response?.data?.message || "Failed to load report savings");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const filtered = rows
    .filter((r) => {
      if (showUnpaidOnly && (r.paymentStatus || "PAID") !== "UNPAID") return false;
      const q = search.toLowerCase();
      return (
        r.user?.firstname?.toLowerCase().includes(q) ||
        r.user?.lastname?.toLowerCase().includes(q) ||
        r.user?.memberID?.toLowerCase().includes(q)
      );
    })
    .map((r) => {
      const expected = r.savingAmount || 0;
      const paid = r.paidAmount || 0;
      const debt = Math.max(0, expected - paid);
      return { ...r, expected, paid, debt };
    });

  const userOptions = Array.from(
    new Map(
      rows.map((r) => [
        r.user?.id,
        {
          value: r.user?.id,
          label: `${r.user?.firstname || ""} ${r.user?.lastname || ""}`.trim(),
        },
      ])
    ).values()
  ).filter((o) => o.value);

  const payRemainingForRow = async (row: any) => {
    try {
      const debt = row.debt || 0;
      if (debt <= 0) return;
      await axiosInstance.post(url + `/savings/${row.id}/pay`, {
        amount: debt,
        remainderAsPredeposit: true,
      });
      toast.success("Marked as PAID");
      await load();
    } catch (e: any) {
      handleApiError(e, handleLogout);
      toast.error(e.response?.data?.message || "Payment failed");
    }
  };

  const payMultipleDebts = async () => {
    try {
      if (!selectedUserId) {
        toast.error("Select a member");
        return;
      }
      if (!amount || amount <= 0) {
        toast.error("Enter amount");
        return;
      }
      setPaying(true);
      await axiosInstance.post(url + "/savings/pay-debt", {
        userId: selectedUserId,
        amount,
        remainderAsPredeposit: true,
      });
      toast.success("Payment applied to multiple unpaid months");
      setAmount(0);
      await load();
    } catch (e: any) {
      handleApiError(e, handleLogout);
      toast.error(e.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Monthly Savings Status (Paid / Unpaid)
        </h3>
        <button
          className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md border border-indigo-200 hover:bg-indigo-200"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Pay multiple unpaid months (easy)
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              <Select
                className="md:w-80"
                placeholder="Select member"
                options={userOptions as any}
                value={selectedUserId}
                onChange={(v) => setSelectedUserId(v)}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.label || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
              <input
                type="number"
                className="border border-gray-300 p-2 rounded-md w-full md:w-56 outline-none"
                placeholder="Amount"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                onClick={payMultipleDebts}
                disabled={paying}
              >
                {paying ? "Paying..." : "Pay"}
              </button>
            </div>
            <div className="text-xs text-gray-500">
              This will clear the oldest unpaid months first, and any extra becomes
              predeposit.
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              type="text"
              placeholder="Search member"
              className="border border-gray-300 p-2 rounded-md w-full md:w-80 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showUnpaidOnly}
                onChange={(e) => setShowUnpaidOnly(e.target.checked)}
              />
              Show UNPAID only
            </label>
          </div>
        </div>
      </div>

      <div className="invoice-table-row invoice-table-header bg-white mt-6 rounded-xl px-6 py-3 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[26%]">Member</div>
        <div className="text-left w-[14%]">Expected</div>
        <div className="text-left w-[14%]">Paid</div>
        <div className="text-left w-[14%]">Debt</div>
        <div className="text-left w-[12%]">Status</div>
        <div className="text-left w-[20%]">Action</div>
      </div>

      <div className="bg-white mt-4 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {filtered.map((r: any) => (
          <div
            key={r.id}
            className="invoice-table-row flex items-center justify-between px-6 py-3"
          >
            <div className="text-left w-[26%]">
              {r.user?.firstname} {r.user?.lastname}{" "}
              <span className="text-xs text-gray-400 ml-2">
                ({r.user?.memberID})
              </span>
            </div>
            <div className="text-left w-[14%]">
              {formatCurrency(r.expected)} RWF
            </div>
            <div className="text-left w-[14%]">
              {formatCurrency(r.paid)} RWF
            </div>
            <div className="text-left w-[14%]">
              {formatCurrency(r.debt)} RWF
            </div>
            <div className="text-left w-[12%]">
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  (r.paymentStatus || "PAID") === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {r.paymentStatus || "PAID"}
              </span>
            </div>
            <div className="text-left w-[20%]">
              {(r.paymentStatus || "PAID") === "PAID" ? (
                <span className="text-gray-400">—</span>
              ) : (
                <button
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                  onClick={() => payRemainingForRow(r)}
                >
                  Mark paid
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="px-6 py-6 text-center text-gray-400">
            No savings found.
          </div>
        )}
      </div>
    </div>
  );
}

