import React, { useEffect, useState } from "react";
import "./HistoryPage.css";

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);

  // Format backend type → human readable
  const formatType = (type) => {
  switch (type) {
    case "withdraw":
      return "Withdraw";
    case "deposit":
      return "Deposit";
    case "transfer_sent":
      return "Transfer Sent";
    case "transfer_received":
      return "Transfer Received";
    default:
      return type;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.toLocaleString("en-GB", { day: "2-digit" });
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.toLocaleString("en-GB", { year: "numeric" });
  const time = date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} ${month} ${year} • ${time}`;
};



  // Fetch transactions
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/wallet/transactions", {
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
});

        const data = await res.json();

        setTransactions(data.transactions || []);
      } catch (err) {
        console.log("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h2>Transaction History</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <tr key={index}>
                <td>{formatType(tx.type)}</td>
                <td>£{tx.amount}</td>
                <td>{formatDate(tx.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
