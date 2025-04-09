/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import ExpenseActivityForm from "../components/expenseActivities/ExpenseActivityForm";
import ExpenseActivitiesTable from "../components/expenseActivities/ExpenseActivitiesTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type ExpenseActivity = {
  date: string;
  activity: string;
  amount: number;
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

const ExpenseActivitiesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseActivities, setExpenseAcitivities] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [expenseActivity, setExpenseActivity] = useState<
    Partial<ExpenseActivity>
  >({
    date: new Date().toISOString(),
    activity: "",
    amount: 0,
    description: "",
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/expense-activities");
        setExpenseAcitivities(response.data?.data || []);
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
    setExpenseActivity((prevExpenseActivity) => ({
      ...prevExpenseActivity,
      [name]: value,
    }));
  };

  const saveExpenseActivity = async (isBond: boolean = false) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        url + "/expense-activities-requests",
        { ...expenseActivity, is_bond: isBond }
      );
      console.log(response.data);
      toast.success("Expense Activity request created successfully");
      setExpenseActivity({
        date: new Date().toISOString(),
        activity: "",
        amount: 0,
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
      title="Expense Activities"
      newButtonTitle="New Expense Activity"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Expense Activity</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <ExpenseActivityForm
          newExpenseActivity={expenseActivity}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveExpenseActivity}
          onClose={closeModal}
        />
      </Modal>
      <ExpenseActivitiesTable expenseActivities={expenseActivities} />
    </MainLayout>
  );
};

export default ExpenseActivitiesPage;
