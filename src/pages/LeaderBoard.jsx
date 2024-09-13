import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  // State to store leaderboard data fetched from the API
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("http://localhost:8080/leaderboard");
        const data = await response.json();  // Parse the JSON response
        setLeaderboardData(data);  // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);  // Handle errors
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
                  <div className="text-gray-500">{player.date}</div>
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
