import React, { useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

type Props = {
  title: string;
  children?: React.ReactNode;
  onNewButtonClick?: () => void;
  newButtonTitle?: string;
  hideNewButton?: boolean;
  hideFilters?: boolean;
};

const MainLayout = ({
  children,
  title,
  onNewButtonClick,
  newButtonTitle,
  hideNewButton,
  hideFilters = false,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeRoute = location.pathname.split("/dashboard")[1];
  const { isLoggedIn } = useContext(AppContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <div>
      <div className="flex min-h-screen 2xl:max-w-[130rem] 2xl:mx-auto 2xl:border-x-4 2xl:border-gray-300">
        <Sidebar activeRoute={activeRoute} />

        <main className="bg-indigo-50/60 w-full py-10 px-3 sm:px-10 border-t-4 border-b-4 border-gray-200">
          <Nav
            title={title}
            onNewButtonClick={onNewButtonClick}
            newButtonTitle={newButtonTitle}
            hideNewButton={hideNewButton}
          />
          {!hideFilters && <FiltersSection title={title} />}
          {children}
        </main>
      </div>
    </div>
  );
};

const Dropdown = ({ closeDropdown }: { closeDropdown: () => void }) => {
  const { handleLogout } = useContext(AppContext || {});
  return (
    <div className="absolute top-1 right-0 mt-10 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-indigo-200">
      <Link
        to="/dashboard/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
        onClick={closeDropdown}
      >
        Profile
      </Link>
      <a
        href="#"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
        onClick={() => {
          handleLogout?.();
          closeDropdown();
        }}
      >
        Logout
      </a>
    </div>
  );
};

const Nav = ({
  title,
  onNewButtonClick,
  newButtonTitle = "Create New",
  hideNewButton,
}: Props) => {
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav className="text-lg flex items-center justify-between content-center border-b-2 border-gray-300 pb-4">
      <div className="font-medium text-xl text-gray-800 flex space-x-4 items-center">
        <a href="#">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {/* Insert navigation icon here */}
          </svg>
        </a>
        <span>{title}</span>
      </div>
      <div className="flex space-x-5 md:space-x-10 text-gray-500 items-center content-center text-base">
        {!hideNewButton && (
          <button
            className="px-4 py-2 bg-indigo-100 rounded-md flex items-center space-x-2 text-indigo-500 hover:bg-indigo-200 border border-indigo-300"
            onClick={onNewButtonClick}
          >
            <svg
              className="h-5 w-5 fill-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div>
              <span>{newButtonTitle}</span>
            </div>
          </button>
        )}
        <div className="relative">
          <img
            className="rounded-full w-10 h-10 border-2 border-indigo-200 hover:border-indigo-300 cursor-pointer"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5eW8OvSN4zaimWuFO2ff4Q-Es1FS8ajh4WA&usqp=CAU"
            alt="Profile"
            onClick={toggleDropdown}
          />
          {isDropdownVisible && <Dropdown closeDropdown={toggleDropdown} />}
        </div>
      </div>
    </nav>
  );
};

const FiltersSection = ({ title }: { title: string }) => {
  return (
    <section>
      <div className="bg-indigo-100/70 mt-12 rounded-xl px-5 sm:px-10 pt-8 pb-4 relative xl:bg-[url('../images/invoice.png')] bg-no-repeat bg-right bg-contain border-2 border-gray-200">
        <div className="text-indigo-400 font-medium text-lg">All {title}</div>

        <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 gap-y-6 gap-x-6 md:flex md:space-x-6 md:gap-x-0">
          <FilterInput
            label="Begin Date"
            defaultValue={new Date().toLocaleDateString()}
          />
          <FilterInput
            label="End Date"
            defaultValue={new Date().toLocaleDateString()}
          />
          <FilterSelect label="Status" options={["Any"]} />
          <FilterSelect label="Client" options={["Any"]} />
        </div>

        <div className="mt-5 text-gray-500 text-sm">
          * This data has been shown according to your given information
        </div>
      </div>
    </section>
  );
};

interface FilterInputProps {
  label: string;
  defaultValue: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ label, defaultValue }) => {
  return (
    <div className="flex flex-col md:w-40 text-gray-600 text-sm space-y-2 font-normal">
      <label htmlFor={label}>{label}</label>
      <div className="inline-flex relative">
        <input
          className="bg-indigo-800/80 text-white tracking-wider pl-4 pr-10 py-3 rounded-lg appearance-none w-full outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 border border-indigo-300"
          id={label}
          name={label}
          type="text"
          value={defaultValue}
        />
        <span className="absolute top-0 right-0 m-3 pointer-events-none text-white">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  );
};

interface FilterSelectProps {
  label: string;
  options: string[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, options }) => {
  return (
    <div className="flex flex-col md:w-40 text-gray-600 text-sm space-y-2 font-medium">
      <label htmlFor={label}>{label}</label>
      <div className="inline-flex relative">
        <select
          className="bg-indigo-400 text-white px-4 py-3 rounded-lg appearance-none w-full outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 border border-indigo-300"
          id={label}
          name={label}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="absolute top-0 right-0 m-3 pointer-events-none text-white">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default MainLayout;
