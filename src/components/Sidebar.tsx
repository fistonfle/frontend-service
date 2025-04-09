/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import {
  FaBars,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaCog,
  FaFileExcel,
  FaFileInvoice,
  FaFolder,
  FaHome,
  FaMoneyBill,
  FaMoneyBillWave,
  FaMoneyCheck,
  FaPiggyBank,
  FaSignOutAlt,
  FaStore,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Sidebar = ({ activeRoute = "" }: { activeRoute?: string }) => {
  return (
    <aside className="bg-[#060270] w-1/5 py-10 pl-10 min-w-min border-r border-indigo-900/20 hidden md:block h-screen sticky top-0 left-0">
      <div className="font-bold text-2xl text-white">Fam Gold</div>
      <Menu activeRoute={activeRoute} />
    </aside>
  );
};

const Menu = ({ activeRoute = "" }: { activeRoute?: string }) => {
  const { user } = useContext(AppContext);
  let menuItems = [
    {
      icon: <FaHome />,
      text: "Dashboard",
      url: "/",
    },
    { icon: <FaBars />, text: "Loan Types", url: "/loan-types" },
    { icon: <FaMoneyCheck />, text: "Loans", url: "/loans" },
    { icon: <FaMoneyCheck />, text: "Loan Requests", url: "/loan-requests" },
    { icon: <FaMoneyBill />, text: "Payments", url: "/payments" },
    { icon: <FaPiggyBank />, text: "Savings", url: "/savings" },
    { icon: <FaChartArea />, text: "Savings Totals", url: "/saving-totals" },
    { icon: <FaMoneyBillWave />, text: "Withdrawals", url: "/withdrawals" },
    {
      icon: <FaMoneyBillWave />,
      text: "Withdrawal Requests",
      url: "/withdrawal-requests",
    },
    { icon: <FaFileInvoice />, text: "Monthly Reports", url: "/reports" },
    { icon: <FaChartLine />, text: "Income Savings", url: "/income-savings" },
    {
      icon: <FaChartBar />,
      text: "Expense Contributions",
      url: "/expense-contributions",
    },
    { icon: <FaFolder />, text: "Batches", url: "/batches" },
    { icon: <FaUsers />, text: "Members", url: "/users" },
    {
      icon: <FaCog />,
      text: "Member Profile Edits",
      url: "/profile-edit-requests",
    },
    { icon: <FaStore />, text: "Bank Balance", url: "/bank-balance" },
    { icon: <FaSignOutAlt />, text: "Exit Requests", url: "/exit-requests" },
    { icon: <FaMoneyCheck />, text: "Request Loan", url: "/request-loan" },
    {
      icon: <FaMoneyBillWave />,
      text: "Request Withdrawal",
      url: "/request-withdrawal",
    },
    {
      icon: <FaSignOutAlt />,
      text: "Request Exit",
      url: "/request-exit",
    },
    // { icon: <FaFileExcel />, text: "Import Data", url: "/import-data" },
  ];

  if (
    user?.info?.role === "PRESIDENT" ||
    user?.info?.role === "VICE_PRESIDENT"
  ) {
    menuItems = [
      {
        icon: <FaHome />,
        text: "Dashboard",
        url: "/",
      },
      { icon: <FaUsers />, text: "Members", url: "/users" },
      {
        icon: <FaCog />,
        text: "Member Profile Edits",
        url: "/profile-edit-requests",
      },
      { icon: <FaMoneyCheck />, text: "Loan Requests", url: "/loan-requests" },
      {
        icon: <FaMoneyCheck />,
        text: "Withdrawal Requests",
        url: "/withdrawal-requests",
      },
      {
        icon: <FaChartLine />,
        text: "Income Requests",
        url: "/income-requests",
      },
      {
        icon: <FaChartBar />,
        text: "Expense Requests",
        url: "/expense-requests",
      },
      { icon: <FaSignOutAlt />, text: "Exit Requests", url: "/exit-requests" },
      { icon: <FaMoneyCheck />, text: "Request Loan", url: "/request-loan" },
      {
        icon: <FaMoneyBillWave />,
        text: "Request Withdrawal",
        url: "/request-withdrawal",
      },
      {
        icon: <FaSignOutAlt />,
        text: "Request Exit",
        url: "/request-exit",
      },
      { icon: <FaFileExcel />, text: "Import Data", url: "/import-data" },
    ];
  }

  if (user?.info?.role === "STANDARD") {
    menuItems = [
      {
        icon: <FaHome />,
        text: "Dashboard",
        url: "/",
      },
      { icon: <FaUsers />, text: "Profile", url: "/profile" },
      { icon: <FaMoneyCheck />, text: "Request Loan", url: "/request-loan" },
      {
        icon: <FaMoneyBillWave />,
        text: "Request Withdrawal",
        url: "/request-withdrawal",
      },
      {
        icon: <FaSignOutAlt />,
        text: "Request Exit",
        url: "/request-exit",
      },
    ];
  }

  return (
    <div className="mt-12 flex flex-col space-y-7 text-gray-500 font-medium">
      {menuItems.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          text={item.text}
          url={item.url}
          isActive={activeRoute === item.url}
        />
      ))}
    </div>
  );
};

const SidebarItem = ({
  icon,
  text,
  url,
  isActive = false,
}: {
  icon: any;
  text: string;
  url: string;
  isActive?: boolean;
}) => {
  return (
    <Link
      className={`flex items-center space-x-2 py-1 text-[15px] group hover:border-r-2 hover:border-r-[#060270] hover:font-semibold ${
        isActive
          ? "border-r-2 border-r-[#060270] font-semibold text-[#fff]"
          : ""
      }`}
      to={`/dashboard${url}`}
    >
      <span className={`${isActive ? "text-[#fff]" : ""}`}>{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
