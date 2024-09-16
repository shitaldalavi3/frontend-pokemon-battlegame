import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg_Poke from "../assets/image/bg 2.jpeg";

const LeaderBoard = () => {
  const username = JSON.parse(localStorage.getItem("username")) || ""; // Fetch username from localStorage
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("http://localhost:8080/leaderboard");
        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg_Poke})` }} // Apply the background image
    >
      <div className="p-10 w-4/5 md:w-3/5 lg:w-2/5 z-20 relative bg-black bg-opacity-70 rounded-lg">
        <table className="w-full text-center rounded-lg overflow-hidden">
          <thead className="bg-red-700">
            <tr>
              <th className="p-4 text-white">Username</th>
              <th className="p-4 text-white">Battles</th>
              <th className="p-4 text-white">Won</th>
              <th className="p-4 text-white">Lost</th>
              <th className="p-4 text-white">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length > 0 ? (
              leaderboardData.map((player) => (
                <tr
                  key={player._id}
                  className={`${
                    username === player.username ? "bg-red-400" : ""
                  }`}
                >
                  <td
                    className={`p-4 text-white border-b-2 border-white ${
                      username === player.username ? "font-extrabold" : "font-normal"
                    }`}
                  >
                    {player.username}
                  </td>
                  <td
                    className={`p-4 text-white border-b-2 border-white ${
                      username === player.username ? "font-extrabold" : "font-normal"
                    }`}
                  >
                    {player.battles}
                  </td>
                  <td
                    className={`p-4 text-white border-b-2 border-white ${
                      username === player.username ? "font-extrabold" : "font-normal"
                    }`}
                  >
                    {player.won}
                  </td>
                  <td
                    className={`p-4 text-white border-b-2 border-white ${
                      username === player.username ? "font-extrabold" : "font-normal"
                    }`}
                  >
                    {player.lost}
                  </td>
                  <td
                    className={`p-4 text-white border-b-2 border-white ${
                      username === player.username ? "font-extrabold" : "font-normal"
                    }`}
                  >
                    {player.score}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-white">
                  No leaderboard data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-center mt-8">
          <Link to="/home">
            <button className="bg-black text-white p-2 pl-5 pr-5 rounded-full inline-block transition animate-fire">
              Play again!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
