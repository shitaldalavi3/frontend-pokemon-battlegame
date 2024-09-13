import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("http://localhost:8080/leaderboard");
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        <div className="bg-gray-100 p-4 rounded shadow">
          <ul>
            {leaderboardData.length > 0 ? (
              leaderboardData.map((player, index) => (
                <li key={player._id} className="mb-2">
                  <div className="flex justify-between">
                    <span className="font-bold">
                      {index + 1}. {player.username}
                    </span>
                    <span>Score: {player.score}</span>
                  </div>
                  <div className="text-gray-500">
                    Battles: {player.battles}, Wins: {player.won}, Losses: {player.lost}
                  </div>
                  <div className="text-gray-500">{new Date(player.date).toLocaleDateString()}</div>
                </li>
              ))
            ) : (
              <li>No leaderboard data available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
