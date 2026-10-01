import React, { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const login = async () => {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password
    });
    setToken(res.data.token);
    alert("Login Success");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Smart Procurement UI</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br/><br/>
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br/><br/>
      <button onClick={login}>Login</button>

      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default App;
