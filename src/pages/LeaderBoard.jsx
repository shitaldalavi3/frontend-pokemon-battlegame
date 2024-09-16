import React, { useState, useEffect } from "react";

const LeaderBoard = () => {
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
    <div className="bg-black min-h-screen text-white p-3">
      <div className="container mx-auto py-8 p-3 ">
        <h1 className="text-3xl font-bold mb-4 p-3 text-center">Leaderboard</h1>
        <div className=" bg-red-700 rounded shadow p-3">
          <ul>
            {leaderboardData.length > 0 ? (
              leaderboardData.map((player, index) => (
                <React.Fragment key={player._id}>
                  <li className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-bold">
                        {index + 1}. {player.username}
                      </span>
                      <span>Score: {player.score}</span>
                    </div>
                    <div className="text-black">
                      Battles: {player.battles}, Wins: {player.won}, Losses:{" "}
                      {player.lost}
                    </div>
                    <div className="text-black" m>
                      {new Date(player.date).toLocaleDateString()}
                    </div>
                  </li>
                  {index < leaderboardData.length - 1 && (
                    <hr className="border-gray-600" />
                  )}
                </React.Fragment>
                // </li>
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

export default LeaderBoard;
