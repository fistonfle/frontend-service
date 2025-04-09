/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import SavingTotalsTable from "../components/savingTotals/SavingTotalsTable";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { AppContext } from "../context/AppContext";
import { handleApiError } from "../utils/handleApiError";

const SavingTotalsPage = () => {
  const [savingTotals, setSavingTotals] = useState<any[]>([]);
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/saving-totals");
        setSavingTotals(response.data?.data || []);
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, []);

  return (
    <MainLayout title="Users Total Savings" hideNewButton>
      <SavingTotalsTable savingTotals={savingTotals} />
    </MainLayout>
  );
};

export default SavingTotalsPage;
