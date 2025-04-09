/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import LoanForm from "../components/loans/LoanForm";
import LoansTable from "../components/loans/LoansTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type Loan = {
  date: string;
  startPaymentDate: string;
  loanTypeId: string;
  amount: number;
  userId: string;
  memberID: string;
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

const LoansPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loan, setLoan] = useState<Partial<Loan>>({
    date: new Date().toISOString().split("T")[0],
    startPaymentDate: new Date().toISOString().split("T")[0],
    loanTypeId: "",
    amount: 0,
    userId: "",
    memberID: "",
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/loans");
        setLoans(response.data?.data || []);
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
    setLoan((prevLoan) => ({
      ...prevLoan,
      [name]: value,
    }));
  };

  const saveLoan = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(url + "/loan-requests", {
        ...loan,
        date: new Date(loan.date ?? "").toISOString(),
        startPaymentDate: new Date(loan.startPaymentDate ?? "").toISOString(),
      });
      console.log(response.data);
      toast.success("Loan created successfully");
      setLoan({
        date: new Date().toISOString().split("T")[0],
        startPaymentDate: new Date().toISOString().split("T")[0],
        loanTypeId: "",
        amount: 0,
        userId: "",
        memberID: "",
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
      title="Loans"
      newButtonTitle="New Loan"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Loan</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <LoanForm
          newLoan={loan}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveLoan}
          onClose={closeModal}
        />
      </Modal>
      <LoansTable loans={loans} reloadLoans={() => setReload(!reload)} />
    </MainLayout>
  );
};

export default LoansPage;
