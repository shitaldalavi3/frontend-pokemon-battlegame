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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/myroster" element={<MyRoster />} />
        <Route path="/" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
