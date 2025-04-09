/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import WithdrawalForm from "../components/withdrawals/WithdrawalForm";
import WithdrawalsTable from "../components/withdrawals/WithdrawalsTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type Withdrawal = {
  id: string;
  batch: any;
  user: any;
  userId: any;
  withdrawAmount: number;
  remainingAmount: number;
  isRelatedToPartialExit: boolean;
  memberID: string;
  amount: number;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    maxHeight: "99vh",
  },
};

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [withdrawal, setWithdrawal] = useState<Partial<Withdrawal>>({
    id: "",
    batch: "",
    user: "",
    userId: "",
    withdrawAmount: 0,
    remainingAmount: 0,
    isRelatedToPartialExit: false,
    memberID: "",
    amount: 0,
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/withdrawals");
        setWithdrawals(response.data?.data || []);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, [reload]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWithdrawal((prevWithdraw) => ({
      ...prevWithdraw,
      [name]: value,
    }));
  };

  const saveWithdrawal = async () => {
    try {
      setSubmitting(true);
      const response = await axiosInstance.post(url + "/withdrawal-requests", {
        ...withdrawal,
        amount: withdrawal.withdrawAmount,
      });
      console.log(response.data);
      toast.success("Withdraw saved successfully");
      setWithdrawal({
        id: "",
        batch: "",
        user: "",
        userId: "",
        withdrawAmount: 0,
        remainingAmount: 0,
        isRelatedToPartialExit: false,
        memberID: "",
        amount: 0,
      });
      closeModal();
      setReload(!reload);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout
      title="Withdrawals"
      newButtonTitle="New Withdrawal"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Withdrawal</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <WithdrawalForm
          newWithdrawal={withdrawal}
          onInputChange={handleInputChange}
          onSave={saveWithdrawal}
          onClose={closeModal}
          submitting={submitting}
        />
      </Modal>
      <WithdrawalsTable withdrawals={withdrawals} />
    </MainLayout>
  );
};

export default WithdrawalsPage;
