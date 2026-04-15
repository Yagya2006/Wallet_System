import { useState } from "react";

function Balance() {
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  const totalDeposited = transactions
  .filter(t => t.startsWith("Deposited"))
  .reduce((sum, t) => {
    const amount = Number(t.replace("Deposited £", ""));
    return sum + amount;
  }, 0);

const totalWithdrawn = transactions
  .filter(t => t.startsWith("Withdrew"))
  .reduce((sum, t) => {
    const amount = Number(t.replace("Withdrew £", ""));
    return sum + amount;
  }, 0);




  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Your Balance: £{balance}</h2>
      <p>Total Deposited: £{totalDeposited}</p>
      <p>Total Withdrawn: £{totalWithdrawn}</p>

      <input
  type="number"
  placeholder="Enter amount"
  value={amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  style={{ marginTop: "10px" }}
/>
<button
  onClick={() => setAmount(0)}
  style={{ marginLeft: "10px" }}
>
  Clear
</button>


  <button disabled={amount <= 0}
   onClick={() => {
  setBalance(balance + amount);
  setMessage(`Deposited £${amount} successfully`);
  setTransactions([...transactions, `Deposited £${amount}`]);
  setAmount(0);
}}style={{ marginRight: "10px" }}>
  Deposit
</button>


    <button disabled={amount <= 0}
     onClick={() => {
  if (balance >= amount) {
    setBalance(balance - amount);
    setMessage(`Withdrew £${amount} successfully`);
    setTransactions([...transactions, `Withdrew £${amount}`]);
  setAmount(0);
  } else {
    setMessage("Insufficient balance");
  }
}}>
  Withdraw
</button>


<p>{message}</p>
<h3 style={{ marginTop: "20px" }}>Transaction History</h3>
<ul>
  {transactions.map((t, index) => (
    <li key={index}>{t}</li>
  ))}
</ul>


    </div>
  );
}

export default Balance;
