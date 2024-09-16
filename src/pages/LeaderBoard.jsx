import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomePage from "./HomePage";

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [playerName, setPlayerName] = useState([]);

  // useEffect(() => {
  //   const fetchLeaderboardData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8080/leaderboard");
  //       const data = await response.json();
  //       setLeaderboardData(data);
  //     } catch (error) {
  //       console.error("Error fetching leaderboard data:", error);
  //     }
  //   };

  //   fetchLeaderboardData();
  // }, []);

  // Suppose you have a key called "username" in local storage
  useEffect(() => {
    const fetchDataFromLocalStorage = async () => {
      try {
        const data = localStorage.getItem("username");
        if (data) {
          // Parse the data (assuming it's stored as JSON)
          setPlayerName(data.result);
          return JSON.parse(data);
        }
        return null; // No data found
      } catch (error) {
        console.error("Error fetching data from local storage:", error);
        return null;
      }
    };
    fetchDataFromLocalStorage();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-3">
      <div className="container mx-auto py-8 p-3 ">
        <h1 className="text-3xl font-bold mb-4 p-3 ">Leaderboard</h1>
        {/* <div className=" bg-red-700 rounded shadow p-3"> */}
        <div className="bg-red-700 rounded shadow p-3 overflow-x-auto">
          <table className="table-auto w-full table-striped">
            <thead className="bg-yellow-600">
              <tr className="text-left border-b border-gray-600 bg-red-950">
                <th className="p-2">PlayerId</th>
                <th className="p-2">Name</th>
                <th className="p-2">battle</th>
                <th className="p-2">Won</th>
                <th className="p-2">Lost </th>
                <th className="p-2">Score</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.length > 0 ? (
                leaderboardData.map((player, index) => (
                  <tr
                    key={player._id}
                    className="border-b border-gray-600 text-black text-left"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 font-bold">{player}</td>
                    <td className="p-2">{player.battles}</td>
                    <td className="p-2">{player.won}</td>
                    <td className="p-2">{player.lost}</td>
                    <td className="p-2">{player.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-2 text-center">
                    No leaderboard data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* </div> */}
      </div>
      <div className="flex justify-center items-center ">
        {/* Centered "Play Again" button */}
        <Link
          to="/home"
          className="text-white px-6 py-2 rounded-full inline-block transition animate-fire"
        >
          Play Again
        </Link>
      </div>
    </div>
  );
};

export default LeaderBoard;
