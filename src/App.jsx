import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Leaderboard from "./pages/LeaderBoard";
import MyRoster from "./pages/MyRoster";
import PokemonDetails from "./pages/PokemonDetail";
import BattlePage from "./pages/BattlePage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/Myroster" element={<MyRoster />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
        <Route path="/battle" element={<BattlePage />} />
      </Routes>
    </Router>
  );
};

export default App;
