import WalletPage from "./pages/WalletPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated routes use DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/wallet" element={<WalletPage />} />
          {/* <Route path="/send" element={<SendMoneyPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
