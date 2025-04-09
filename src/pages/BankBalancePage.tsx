/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import CashbookForm from "../components/bankBalance/CashbookForm";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import CashbookReport from "../components/reportsGenerator/CashbookReport";
import { AppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/functions";
import { handleApiError } from "../utils/handleApiError";

type Cashbook = {
  description: string;
  credit: number;
  debit: number;
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

const BankBalancePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankBalance, setBankBalance] = useState<any>({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cashbook, setCashbook] = useState<Partial<Cashbook>>({
    description: "",
    credit: 0,
    debit: 0,
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          url + "/cashbook/bank-balance"
        );
        setBankBalance(response.data?.data || {});
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
    setCashbook((prevCashbook) => ({
      ...prevCashbook,
      [name]: value,
    }));
  };

  const saveCashbook = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        url + "/cashbook/unknown",
        cashbook
      );
      console.log(response.data);
      toast.success("Cashbook saved successfully");
      setCashbook({
        description: "",
        credit: 0,
        debit: 0,
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
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout
      title="Bank Balance"
      newButtonTitle="New Cashbook"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Cashbook</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <CashbookForm
          newCashbook={cashbook}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveCashbook}
          onClose={closeModal}
        />
      </Modal>
      <section>
        <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
          <div className="text-left w-full">Balance</div>
        </div>
        <div className="bg-white my-5 mb-20 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
          {bankBalance && (
            <div className="invoice-table-row flex items-center justify-between px-10 py-4">
              <div className="text-left w-full">
                {formatCurrency(bankBalance?.balance || 0)} RWF
              </div>
            </div>
          )}
        </div>

        <CashbookReport />
      </section>
    </MainLayout>
  );
};

export default BankBalancePage;
