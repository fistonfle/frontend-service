/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import BatchForm from "../components/batch/BatchForm";
import BatchTable from "../components/batch/BatchTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type Batch = {
  id: string;
  date: string;
  status: string;
  closingDate: string;
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

const BatchesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [batch, setBatch] = useState<Partial<Batch>>({
    date: new Date().toISOString().split("T")[0],
    status: "OPEN",
    closingDate: new Date().toISOString().split("T")[0],
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/batch");
        setBatches(response.data?.data || []);
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
    setBatch((prevBatch) => ({
      ...prevBatch,
      [name]: value,
    }));
  };

  const saveBatch = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(url + "/batch", batch);
      console.log(response.data);
      toast.success("Batch created successfully");
      setBatch({
        date: new Date().toISOString().split("T")[0],
        status: "open",
        closingDate: new Date().toISOString().split("T")[0],
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

  const closeBatch = async (batchId: string) => {
    try {
      const response = await axiosInstance.put(url + `/batch/close/${batchId}`);
      console.log(response.data);
      toast.success("Batch closed successfully");
      closeModal();
      setReload(!reload);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const openBatch = async (batchId: string) => {
    try {
      const response = await axiosInstance.put(url + `/batch/open/${batchId}`);
      console.log(response.data);
      toast.success("Batch opened successfully");
      closeModal();
      setReload(!reload);
    } catch (error: any) {
      handleApiError(error, handleLogout);
      console.log(error);
      const errorMessage =
        error.response.data.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <MainLayout
      title="Batches"
      newButtonTitle="New Batch"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Batch</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <BatchForm
          newBatch={batch}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveBatch}
          onClose={closeModal}
        />
      </Modal>
      <BatchTable
        batches={batches}
        reloadBatches={() => setReload(!reload)}
        closeBatch={closeBatch}
        openBatch={openBatch}
      />
    </MainLayout>
  );
};

export default BatchesPage;
