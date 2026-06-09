import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://victus-production.up.railway.app/admin/login",
        { password }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
        }
    } catch {
      alert("Wrong password");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#000",
      color: "#fff"
    }}>
      <div style={{
        padding: "30px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.05)"
      }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px"
          }}
        />

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;