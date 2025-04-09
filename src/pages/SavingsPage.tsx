/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import SavingForm from "../components/savings/SavingForm";
import SavingsTable from "../components/savings/SavingsTable";
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

const SavingsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savings, setSavings] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
      const response = await axiosInstance.post(url + "/savings", saving);
      console.log(response.data);
      toast.success("Income Saving created successfully");
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Saving</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <SavingForm
          newSaving={saving}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveSaving}
          onClose={closeModal}
        />
      </Modal>
      <SavingsTable savings={savings} />
    </MainLayout>
  );
};

export default SavingsPage;
