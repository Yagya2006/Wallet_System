import { useState } from "react";

function Balance() {
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");


  return (
    <div>
      <h2>Your Balance: £{balance}</h2>
      <button onClick={() => setBalance(balance + 10)}>
      Add £10
    </button>
    <button
  onClick={() => {
    if (balance > 0) {
      setBalance(balance - 10);
      setMessage(""); // clear message
    } else {
      setMessage("Insufficient balance");
    }
  }}
>
  Withdraw £10
</button>

<p>{message}</p>


    </div>
  );
}

export default Balance;
