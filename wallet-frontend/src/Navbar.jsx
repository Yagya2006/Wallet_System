import "./Navbar.css";

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <div className="navbar">
  <div className="logo">💰 Wallet App</div>

  <div className="nav-links">
    <Link to="/">Home</Link>
    <Link to="/wallet">Wallet</Link>
  </div>
</div>


    </nav>
  );
}

export default Navbar;
