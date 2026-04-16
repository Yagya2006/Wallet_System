import WalletPage from "./pages/WalletPage";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

import { API_URL } from "./api";

function testBackend() {
  console.log("Button clicked!");
  fetch(`${API_URL}/`)
    .then(res => res.text())
    .then(data => console.log("Backend says:", data))
    .catch(err => console.error("Error:", err));
}

 


function App() {
  return (
    <>
      <Navbar />
      <button onClick={testBackend}>Test Backend</button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
    </>
  );
}



export default App;
