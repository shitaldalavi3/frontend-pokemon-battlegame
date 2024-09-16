// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import BattlePage from "./pages/BattlePage";
import LeaderBoard from "./pages/LeaderBoard";
import MyRoster from "./pages/MyRoster";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} /> {/* Signup page */}
        <Route path="/home" element={<HomePage />} /> {/* Homepage */}
        <Route path="/battle" element={<BattlePage />} /> {/* Battle Page */}
        <Route path="/leaderboard" element={<LeaderBoard />} />{" "}
        {/* Leaderboard */}
        <Route path="/myroster" element={<MyRoster />} /> {/* MyRoster */}
        <Route path="/" element={<SignUp />} />{" "}
        {/* Redirect to signup by default */}
      </Routes>
    </Router>
  );
};

export default App;
