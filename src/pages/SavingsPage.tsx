/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import SavingForm from "../components/savings/SavingForm";
import SavingsTable from "../components/savings/SavingsTable";
import SavingDebtsSummaryTable from "../components/savings/SavingDebtsSummaryTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type Saving = {
  id: string;
  report: any;
  reportId: any;
  user: any;
  userId: any;
  savingAmount: number;
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

const summaryModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "85%",
    maxHeight: "95vh",
  },
};

const SavingsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savings, setSavings] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [debtsSummary, setDebtsSummary] = useState<any[]>([]);
  const [action, setAction] = useState<"MANUAL" | "PREDEPOSIT" | "PAY_DEBT">(
    "PAY_DEBT"
  );
  const [saving, setSaving] = useState<Partial<Saving>>({
    id: "",
    report: "",
    reportId: "",
    user: "",
    userId: "",
    savingAmount: 0,
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/savings");
        setSavings(response.data?.data || []);
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

  const openSummary = async () => {
    try {
      const response = await axiosInstance.get(url + "/savings/debts-summary");
      setDebtsSummary(response.data?.data || []);
      setSummaryModalOpen(true);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaving((prevSaving) => ({
      ...prevSaving,
      [name]: value,
    }));
  };

  const saveSaving = async () => {
    try {
      setIsSubmitting(true);
      if (action === "PREDEPOSIT") {
        await axiosInstance.post(url + "/savings/predeposit", {
          userId: saving.userId,
          amount: saving.savingAmount,
        });
        toast.success("Predeposit saved successfully");
      } else if (action === "PAY_DEBT") {
        await axiosInstance.post(url + "/savings/pay-debt", {
          userId: saving.userId,
          amount: saving.savingAmount,
          remainderAsPredeposit: true,
        });
        toast.success("Saving debt payment processed");
      } else {
        await axiosInstance.post(url + "/savings", saving);
        toast.success("Saving created successfully");
      }
      setSaving({
        id: "",
        report: "",
        reportId: "",
        user: "",
        userId: "",
        savingAmount: 0,
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
      title="Savings"
      newButtonTitle="New Saving"
      onNewButtonClick={openModal}
    >
      <div className="mt-6">
        <button
          className="bg-white shadow-lg rounded-md px-4 py-3 hover:bg-gray-100 transition-all cursor-pointer border border-gray-200"
          onClick={openSummary}
        >
          View Member Debts Summary
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Savings Actions</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <SavingForm
          newSaving={saving}
          action={action}
          onActionChange={setAction}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveSaving}
          onClose={closeModal}
        />
      </Modal>

      <Modal
        isOpen={summaryModalOpen}
        onRequestClose={() => setSummaryModalOpen(false)}
        style={summaryModalStyles}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Member Debts Summary</h2>
          <button onClick={() => setSummaryModalOpen(false)}>Close</button>
        </div>
        <SavingDebtsSummaryTable rows={debtsSummary} />
      </Modal>

      <SavingsTable savings={savings} />
    </MainLayout>
  );
};

export default SavingsPage;
