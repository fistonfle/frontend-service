/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { AppContext } from "../context/AppContext";
import url from "../helpers/url";
import axiosInstance from "../helpers/axios";
import { Link } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import MemberInformationReport from "../components/reportsGenerator/MemberInformationReport";
import { handleApiError } from "../utils/handleApiError";

const HomePage = () => {
  const { reloadUser, user } = useContext(AppContext);
  const [statistics, setStatistics] = React.useState<any>({});
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    reloadUser?.();
    if (!user?.info?.role || user?.info?.role === "STANDARD") return;
    (async () => {
      try {
        const response = await axiosInstance.get(url + "/statistics");
        setStatistics(response.data.data || {});
      } catch (error: any) {
        handleApiError(error, handleLogout);
        // logout if unauthorized
        if (error.response.status === 401) {
          handleLogout?.();
        }
      }
    })();
  }, []);

  const cardsData = [
    {
      title: "Total Savings",
      value: Math.round(statistics.totalSavings || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "RWF",
      }),
      url: "/dashboard/saving-totals",
    },
    {
      title: "Total Remaining Loans",
      value: Math.round(statistics.totalRemainingLoans || 0).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "RWF",
        }
      ),
      url: "/dashboard/loans",
    },
    {
      title: "Total Payments",
      value: Math.round(statistics.totalPayments || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "RWF",
      }),
      url: "/dashboard/payments",
    },
    {
      title: "Total Reports",
      value: statistics.totalReports || 0,
      url: "/dashboard/reports",
    },
    {
      title: "Total Withdrawals",
      value: Math.round(statistics.totalWithdrawals || 0).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "RWF",
        }
      ),
      url: "/dashboard/withdrawals",
    },
    {
      title: "Total Batches",
      value: statistics.totalBatches || 0,
      url: "/dashboard/batches",
    },
    {
      title: "Total Members",
      value: statistics.totalUsers || 0,
      url: "/dashboard/users",
    },
  ];

  return (
    <MainLayout title="Dashboard" hideFilters hideNewButton>
      {/* Dashboard cards showing total savings, total loans, total payments, total reports */}
      {user?.info?.role !== "STANDARD" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {cardsData.map((card, index) => (
            <Link
              key={index}
              className="bg-white shadow-lg rounded-md p-4 hover:bg-gray-100 transition-all"
              to={card.url}
            >
              <div className="flex justify-between items-center">
                <div className="text-gray-600 font-medium text-sm">
                  {card.title}
                </div>
                <div className="text-gray-900 font-bold text-base">
                  {card.value}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Generate report */}
      <div className="mt-8">
        <MemberInformationReport
          userId={user?.info?.id}
          customButton={
            <button className="bg-white shadow-lg rounded-md p-4 hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="text-gray-600 font-medium text-sm">
                  Generate My Membership Report
                </div>
                <FaFilePdf className="ml-2 text-gray-600" />
              </div>
            </button>
          }
        />
      </div>
    </MainLayout>
  );
};

export default HomePage;
