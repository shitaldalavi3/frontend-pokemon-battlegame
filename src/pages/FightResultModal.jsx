import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FightResultModal = ({ winner, playerPokemon }) => {
  const [gameResult, setGameResult] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (winner === playerPokemon) {
      setGameResult("won");
    } else {
      setGameResult("lost");
    }

    const audio = new Audio(winner.cries.latest); // Assuming your winner has a "cries" property
    audio.play();
  }, [winner, playerPokemon]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/leaderboard"); // Navigate to leaderboard after 5 seconds
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-black p-6 rounded-2xl w-96">
        <div className="flex flex-col items-center">
          <h2 className="font-medium text-white text-2xl mb-2">The winner is...</h2>
          <img
            className="h-96"
            src={
              winner.sprites.other.dream_world.front_default
                ? winner.sprites.other.dream_world.front_default
                : winner.sprites.front_default
            }
            alt={winner.name}
          />
          <h1 className="capitalize font-bold text-red-700 text-4xl">{winner.name}</h1>
          {gameResult === "won" ? <h1 className=" font-bold text-white ">Congratulations! You won!</h1> : <h1 className=" font-bold text-white " >Sorry, you lost.</h1>}
        </div>
      </div>
    </div>
  );
};

export default FightResultModal;
