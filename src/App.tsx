import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LoanTypesPage from "./pages/LoanTypesPage";
import BatchesPage from "./pages/BatchesPage";
import UsersPage from "./pages/UsersPage";
import ExpenseActivitiesPage from "./pages/ExpenseActivitiesPage";
import IncomeActivitiesPage from "./pages/IncomeActivitiesPage";
import ReportsPage from "./pages/ReportsPage";
import SavingsPage from "./pages/SavingsPage";
import SavingTotalsPage from "./pages/SavingTotalsPage";
import LoansPage from "./pages/LoansPage";
import PaymentsPage from "./pages/PaymentsPage";
import WithdrawalsPage from "./pages/WithdrawalsPage";
import BankBalancePage from "./pages/BankBalancePage";
import ImportDataPage from "./pages/ImportDataPage";
import LoanRequestsPage from "./pages/LoanRequestsPage";
import RequestLoanPage from "./pages/RequestLoanPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RequestWithdrawalPage from "./pages/RequestWithdrawalPage";
import WithdrawalRequestsPage from "./pages/WithdrawalRequestsPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfileEditRequestsPage from "./pages/UserProfileEditRequestsPage";
import ExitRequestsPage from "./pages/ExitRequestsPage";
import RequestExitPage from "./pages/RequestExitPage";
import IncomeRequestsPage from "./pages/IncomeRequestsPage";
import ExpenseRequestsPage from "./pages/ExpenseRequestsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      {/* dashboard routes */}
      <Route path="dashboard">
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="loan-types" element={<LoanTypesPage />} />
        <Route path="loans" element={<LoansPage />} />
        <Route path="request-loan" element={<RequestLoanPage />} />
        <Route path="loan-requests" element={<LoanRequestsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="savings" element={<SavingsPage />} />
        <Route path="saving-totals" element={<SavingTotalsPage />} />
        <Route path="withdrawals" element={<WithdrawalsPage />} />
        <Route path="request-withdrawal" element={<RequestWithdrawalPage />} />
        <Route
          path="withdrawal-requests"
          element={<WithdrawalRequestsPage />}
        />
        <Route path="request-exit" element={<RequestExitPage />} />
        <Route path="exit-requests" element={<ExitRequestsPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route
          path="profile-edit-requests"
          element={<UserProfileEditRequestsPage />}
        />
        <Route
          path="expense-contributions"
          element={<ExpenseActivitiesPage />}
        />
        <Route path="income-savings" element={<IncomeActivitiesPage />} />
        <Route path="income-requests" element={<IncomeRequestsPage />} />
        <Route path="expense-requests" element={<ExpenseRequestsPage />} />
        <Route path="bank-balance" element={<BankBalancePage />} />
        <Route path="import-data" element={<ImportDataPage />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
