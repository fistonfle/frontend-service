/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Modal from "react-modal";
import ReportForm from "../components/reports/ReportForm";
import ReportsTable from "../components/reports/ReportsTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

type Report = {
  id: string;
  name: string;
  date: string;
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

const ReportsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [report, setReport] = useState<Partial<Report>>({
    name: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [reload, setReload] = useState(false);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/reports");
        setReports(response.data?.data || []);
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
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const saveReport = async () => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(url + "/reports", report);
      console.log(response.data);
      toast.success("Monthly Report created successfully");
      setReport({
        name: "",
        date: new Date().toISOString().split("T")[0],
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
      title="Monthly Reports"
      newButtonTitle="New Monthly Report"
      onNewButtonClick={openModal}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">New Monthly Report</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <ReportForm
          newReport={report}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSave={saveReport}
          onClose={closeModal}
        />
      </Modal>
      <ReportsTable
        reports={reports}
        reloadReports={() => setReload(!reload)}
      />
    </MainLayout>
  );
};

export default ReportsPage;
