import WalletPage from "./pages/WalletPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import SendMoneyPage from "./pages/SendMoneyPage";
import SavingsPage from "./pages/SavingsPage";

import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <>
      {/* Public pages use Navbar */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Authenticated routes use DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/send" element={<SendMoneyPage />} />
          <Route path="/history" element={<HistoryPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} />  */}
          <Route path="/savings" element={<SavingsPage />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
