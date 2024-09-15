import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function UserRegistration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [token, setToken] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        {
          username,
          email,
          password,
        },
        { withCredentials: true } // Add this option
      );
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email: loginEmail,
          password: loginPassword,
        },
        { withCredentials: true }
      );
      setToken(response.data.token);
      console.log("Login successful");
    } catch (error) {
      console.error(error.response.data.error);
    }
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status:
                 ${response.status}`);
      }

      /* 
            Clear any client-side authentication
            data (e.g., token stored in localStorage)
             */
      localStorage.removeItem("token");
      console.log("Logged out");
      // Redirect or update UI as needed after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <h1>Authentication App</h1>
      <div>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </div>
      <div>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      {token && <p>Token: {token}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserRegistration;
