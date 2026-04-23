import { useState } from "react";
import "./LoginPage.css";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // now React knows what setError is

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/wallet"; // Redirect to wallet page after login
 // console.log("Token saved:", localStorage.getItem("token"));
  };

  return (
  <div className="login-page">
    <div className="login-card">
      <h1>Login</h1>

      <input 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input 
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p className="error">{error}</p>}
    </div>
  </div>
);
}

export default LoginPage;
