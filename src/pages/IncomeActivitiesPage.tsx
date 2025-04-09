/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import IncomeActivityForm from "../components/incomeActivities/IncomeActivityForm";
import IncomeActivitiesTable from "../components/incomeActivities/IncomeActivitiesTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type IncomeActivity = {
  date: string;
  activity: string;
  amount: number;
  bankCharges: number;
  description: string;
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

const IncomeActivitiesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incomeActivities, setIncomeActivities] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [incomeActivity, setIncomeActivity] = useState<Partial<IncomeActivity>>(
    {
      date: new Date().toISOString(),
      activity: "",
      amount: 0,
      bankCharges: 0,
      description: "",
    }
  );
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/income-activities");
        setIncomeActivities(response.data?.data || []);
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
    setIncomeActivity((prevIncomeActivity) => ({
      ...prevIncomeActivity,
      [name]: value,
    }));
  };

  const saveIncomeActivity = async (isBond: boolean = false) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post(url + "/income-activities-requests", {
        ...incomeActivity,
        is_bond: isBond,
      });
      toast.success("Income Saving request created successfully");
      setIncomeActivity({
        date: new Date().toISOString(),
        activity: "",
        amount: 0,
        bankCharges: 0,
        description: "",
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
      title="Income Savings"
      newButtonTitle="New Income Saving"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Income Saving</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <IncomeActivityForm
          newIncomeActivity={incomeActivity}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveIncomeActivity}
          onClose={closeModal}
        />
      </Modal>
      <IncomeActivitiesTable incomeActivities={incomeActivities} />
    </MainLayout>
  );
};

export default IncomeActivitiesPage;
