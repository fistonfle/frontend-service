/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import LoanTypeForm from "../components/loan-types/LoanTypeForm";
import LoanTypeTable from "../components/loan-types/LoanTypeTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type LoanType = {
  name: string;
  paymentMonths: number;
  interestRate: number;
  createdAt: string;
  updatedAt: string;
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

const LoanTypesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanTypes, setLoanTypes] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newLoanType, setNewLoanType] = useState<Partial<LoanType>>({
    paymentMonths: 0,
    interestRate: 0,
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  const displayLoanTypes: LoanType[] = loanTypes.map((loanType) => ({
    name: loanType.name,
    paymentMonths: loanType.paymentMonths,
    interestRate: loanType.interestRate,
    createdAt: loanType.createdAt,
    updatedAt: loanType.updatedAt,
  }));

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/loan-types");
        setLoanTypes(response.data?.data || []);
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
    setNewLoanType((prevLoanType) => ({
      ...prevLoanType,
      [name]: value,
    }));
  };

  const saveNewLoanType = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        url + "/loan-types",
        newLoanType
      );
      console.log(response.data);
      toast.success("Loan type created successfully");
      setNewLoanType({
        paymentMonths: 0,
        interestRate: 0,
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
      title="Loan Types"
      newButtonTitle="New Loan Type"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Loan Type</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <LoanTypeForm
          newLoanType={newLoanType}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveNewLoanType}
          onClose={closeModal}
        />
      </Modal>
      <LoanTypeTable loanTypes={displayLoanTypes} />
    </MainLayout>
  );
};

export default LoanTypesPage;
