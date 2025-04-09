/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import PaymentForm from "../components/payments/PaymentForm";
import PaymentsTable from "../components/payments/PaymentsTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type Payment = {
  paymentDate: string;
  userId: string;
  loanId: string;
  paidAmount: number;
  reportId: string;
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

const PaymentsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [payment, setPayment] = useState<Partial<Payment>>({
    paymentDate: new Date().toISOString().split("T")[0],
    userId: "",
    loanId: "",
    paidAmount: 0,
    reportId: "",
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/payments");
        setPayments(response.data?.data || []);
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
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  const savePayment = async (deductFromSavings: boolean) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        url +
          "/payments" +
          (deductFromSavings ? "?deductFromSavings=true" : ""),
        {
          ...payment,
          paymentDate: new Date(payment.paymentDate ?? "").toISOString(),
        }
      );
      console.log(response.data);
      toast.success("Payment created successfully");
      setPayment({
        paymentDate: new Date().toISOString().split("T")[0],
        userId: "",
        loanId: "",
        paidAmount: 0,
        reportId: "",
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
      title="Payments"
      newButtonTitle="New Payment"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Payment</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <PaymentForm
          newPayment={payment}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={savePayment}
          onClose={closeModal}
        />
      </Modal>
      <PaymentsTable payments={payments} />
    </MainLayout>
  );
};

export default PaymentsPage;
