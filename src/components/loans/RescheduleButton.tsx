/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import ReactModal from "react-modal";
import Input from "../reusable/Input";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axios";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { formatCurrency } from "../../utils/functions";
import { AppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

type RescheduleButtonProps = {
  loan: any;
  onRescheduleComplete: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxHeight: "100vh", // Set a maximum height for the content
    // overflowY: "auto", // Enable vertical scrolling
    border: "1px solid #ccc", // Add a border around the content
    borderRadius: "8px", // Add border radius for a rounded appearance
  },
};

const RescheduleButton: React.FC<RescheduleButtonProps> = ({
  loan,
  onRescheduleComplete,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<
    Partial<{
      paymentMonths: number;
    }>
  >({});
  const [remainingBalance, setRemainingBalance] = React.useState({
    loanId: "",
    amount: 0,
  });
  const { handleLogout } = React.useContext(AppContext);

  const handleRescheduleClick = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRescheduleData({ ...rescheduleData, [e.target.name]: e.target.value });
  };

  const onSave = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        `/loans/reschedule/${loan?.id}`,
        rescheduleData
      );
      if (response.data) {
        toast.success("Loan rescheduled successfully");
        onRescheduleComplete();
        closeModal();
      }
    } catch (error: any) {
      handleApiError(error, handleLogout);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (loan.id !== remainingBalance.loanId) {
          setRemainingBalance({
            loanId: "",
            amount: 0,
          });
        }
        if (loan.id) {
          const response = await axiosInstance.get(
            "/loans/remaining-payment-amount/" + loan.id
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
  }, [loan.id]);
  return (
    <div>
      <ReactTooltip place="top" anchorSelect=".reschedule">
        <span>Reschedule Loan</span>
      </ReactTooltip>
      <FaClock
        className="text-sm text-gray-500 ml-2 cursor-pointer reschedule"
        onClick={handleRescheduleClick}
      />
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">
            Reschedule Loan: {loan?.loanNumber}
          </h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <div className="p-4 bg-white rounded-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
            className="space-y-5"
          >
            <div className="flex flex-col space-y-3">
              <p className="text-gray-600">
                Remaining Payment Balance:{" "}
                {formatCurrency(loan.amount || 0)} RWF being paid at
                a rate of {formatCurrency(loan?.paymentPerMonth)} RWF per month
              </p>
              <Input
                type="number"
                label="Payment Months"
                name="paymentMonths"
                value={rescheduleData.paymentMonths || ""}
                onInputChange={onInputChange}
              />
              {rescheduleData.paymentMonths && (
                <p className="text-gray-600">
                  New Monthly Payment:{" "}
                  {formatCurrency(
                    remainingBalance.amount / rescheduleData.paymentMonths
                  )}{" "}
                  RWF for {rescheduleData.paymentMonths} months
                </p>
              )}
            </div>
            <div className="flex justify-end mt-5">
              <button
                className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Rescheduling..." : "Reschedule"}
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};

export default RescheduleButton;
