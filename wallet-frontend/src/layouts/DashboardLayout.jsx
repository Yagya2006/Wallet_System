import "./DashboardLayout.css";
import { NavLink } from "react-router-dom";

import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">

      {/* Top bar (mobile) */}
      <div className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>

        <nav>
          <NavLink to="/wallet" className={({ isActive }) => isActive ? "active" : ""}>
  Dashboard
</NavLink>

          <Link to="/send">Send Money</Link>
          <NavLink to="/history" className={({ isActive }) => isActive ? "active" : ""}>
  Transaction History
</NavLink>

          <Link to="/profile">Profile</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main content */}
      <div className="content">
        <Outlet />
      </div>

    </div>
  );
}
