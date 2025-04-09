/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ReactModal from "react-modal";
import BatchForm from "./BatchForm";
import axiosInstance from "../../helpers/axios";
import url from "../../helpers/url";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import { AppContext } from "../../context/AppContext";

type Batch = {
  id: string;
  date: string;
  status: string;
  closingDate: string;
  batchNumber: number;
};

type BatchTableProps = {
  batches: Batch[];
  closeBatch: (id: string) => void;
  openBatch: (id: string) => void;
  reloadBatches: () => void;
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

const BatchTable: React.FC<BatchTableProps> = ({
  batches,
  closeBatch,
  openBatch,
  reloadBatches,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Partial<Batch>>({});
  const { handleLogout } = React.useContext(AppContext);

  const openModal = (batch: Batch) => {
    setModalIsOpen(true);
    setSelectedBatch(batch);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBatch({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedBatch((prevBatch) => ({
      ...prevBatch,
      [name]: value,
    }));
  };

  const saveBatch = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        url + `/batch/${selectedBatch.id}`,
        {
          date: selectedBatch.date,
          status: selectedBatch.status,
          closingDate: selectedBatch.closingDate,
        }
      );
      console.log(response.data);
      toast.success("Batch created successfully");
      closeModal();
      reloadBatches();
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
    <section>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Batch</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <BatchForm
          newBatch={{
            date: selectedBatch.date
              ? new Date(selectedBatch.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            status: selectedBatch.status,
            closingDate: selectedBatch.closingDate
              ? new Date(selectedBatch.closingDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          }}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveBatch}
          onClose={closeModal}
        />
      </ReactModal>
      <div className="invoice-table-row invoice-table-header bg-white mt-10 rounded-xl px-10 py-4 flex items-center justify-between gap-x-3 text-sm font-semibold text-gray-600">
        <div className="text-left w-[20%]">Batch Number</div>
        <div className="text-left w-[20%]">Date</div>
        <div className="text-left w-[20%]">Status</div>
        <div className="text-center w-[20%]">Closing Date</div>
        <div className="text-center w-[20%]">Actions</div>
      </div>
      <div className="bg-white mt-5 rounded-xl text-sm text-gray-500 divide-y divide-indigo-50 overflow-x-auto shadow">
        {batches.map((batch, index) => (
          <div
            key={index}
            className="invoice-table-row flex items-center justify-between px-10 py-4"
          >
            <div className="text-left w-[20%]">{batch.batchNumber}</div>
            <div className="text-left w-[20%]">
              {new Date(batch.date).toLocaleDateString()}
            </div>
            <div className="text-left w-[20%]">
              {batch.status === "CLOSED" ? (
                <span className="px-4 py-1 rounded-lg bg-rose-400  text-white">
                  {batch.status}
                </span>
              ) : (
                <span className="px-4 py-1 rounded-lg bg-indigo-400  text-white">
                  {batch.status}
                </span>
              )}
            </div>
            <div className="text-center w-[20%]">
              {new Date(batch.closingDate).toLocaleDateString()}
            </div>
            <div className="w-[20%] flex items-center justify-center">
              {batch.status === "OPEN" ? (
                <>
                  <button
                    className="text-indigo-600 hover:text-indigo-900 ml-2"
                    onClick={() => openModal(batch)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-2"
                    onClick={() => closeBatch(batch.id)}
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  className="text-green-600 hover:text-primary-900 ml-2"
                  onClick={() => openBatch(batch.id)}
                >
                  Open
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BatchTable;
