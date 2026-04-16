import Navbar from "../Navbar";
import { Link } from "react-router-dom";

import Balance from "../Balance";
function WalletPage() {
  return (
    <div style={{ padding: "20px" }}>

      <h1>Wallet App</h1>
      <Balance />

    </div>
  );
}
export default WalletPage;
