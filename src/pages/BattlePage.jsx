import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FightResultModal from "./FightResultModal";
import battleGrounds from "../assets/image/newbg.webp";
import battleSound from "../assets/sound/pokemon-battle.mp3"; 

const BattlePage = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || null; // Retrieve selected Pokemon from state
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [playerHealth, setPlayerHealth] = useState(0);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [fightEnded, setFightEnded] = useState(false); // Tracks if the battle has ended
  const [winner, setWinner] = useState(null); // Tracks the winner of the battle
  const [counter, setCounter] = useState(3);
  const [openModal, setOpenModal] = useState(false); // Controls modal visibility
  const [battleInitiated, setBattleInitiated] = useState(false); // New state to control when the battle starts

  const battleAudio = useRef(new Audio(battleSound)); // Use useRef to create a single audio instance
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPokemon) {
      setPlayerPokemon(selectedPokemon); // Set the selected Pokemon as player's Pokemon
    }
  }, [selectedPokemon]);

  const getRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json();
  };

  const calculateTotalStats = (pokemon) => {
    if (!pokemon || !pokemon.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  // Start the countdown and battle when the button is clicked
  useEffect(() => {
    if (battleInitiated && counter > 0) {
      const countdownInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else if (counter === 0) {
      startBattle();
      // Play the battle sound when the battle starts
      const audio = battleAudio.current;
      audio.loop = true; // Loop the audio during the battle
      audio.play();
    }
  }, [battleInitiated, counter]);

  const startBattle = async () => {
    if (!playerPokemon) {
      alert("Please select a Pokémon to battle with.");
      return;
    }

    const enemy = await getRandomPokemon();
    setEnemyPokemon(enemy);
    setPlayerHealth(playerPokemon.stats[0].base_stat);
    setEnemyHealth(enemy.stats[0].base_stat);

    const playerAttack = playerPokemon.stats[1].base_stat;
    const opponentDefense = enemy.stats[2].base_stat;
    const opponentAttack = enemy.stats[1].base_stat;
    const playerDefense = playerPokemon.stats[2].base_stat;

    const damageToOpponent = Math.max(playerAttack - opponentDefense, 10);
    const damageToPlayer = Math.max(opponentAttack - playerDefense, 10);

    const battleInterval = setInterval(() => {
      setEnemyHealth((prev) => {
        const newHealth = Math.max(prev - damageToOpponent, 0);
        if (newHealth <= 0) {
          clearInterval(battleInterval);
          setFightEnded(true); // Battle ended
          setWinner(playerPokemon); // Player wins
        }
        return newHealth;
      });

      setPlayerHealth((prev) => {
        const newHealth = Math.max(prev - damageToPlayer, 0);
        if (newHealth <= 0) {
          clearInterval(battleInterval);
          setFightEnded(true); // Battle ended
          setWinner(enemy); // Enemy wins
        }
        return newHealth;
      });
    }, 1000);
  };

  // Function to update leaderboard
  const updateLeaderboard = async (username, score, battles, won, lost) => {
    try {
      const response = await fetch("https://backend-pockemon-battlegame.onrender.com/leaderboard", {
        method: "POST", // Use POST to either create or update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          score,
          battles,
          won,
          lost,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update leaderboard");
      }

      const data = await response.json();
      console.log("Leaderboard updated successfully:", data);
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  // Show result modal after the battle ends
  useEffect(() => {
    if (fightEnded && winner) {
      // Make sure fightEnded and winner are both set before showing modal
      setTimeout(() => {
        // Stop the battle music before showing the result
        const audio = battleAudio.current;
        audio.pause(); // Stop the audio
        audio.currentTime = 0; // Reset the audio to the start

        // Get the result details for the leaderboard
        const battles = 1; // Assuming each battle counts as 1
        const won = winner === playerPokemon ? 1 : 0;
        const lost = winner !== playerPokemon ? 1 : 0;
        const score = won ? 10 : -5; // Example score: +10 for win, -5 for loss
        const username = JSON.parse(localStorage.getItem("username")) || "Unknown"; // Get username from localStorage

        // Call the updateLeaderboard function
        updateLeaderboard(username, score, battles, won, lost);

        setOpenModal(true); // Open the result modal after the battle ends
      }, 2000);
    }
  }, [fightEnded, winner]);

  const getPokemonImageUrl = (pokemon, isBackImage = false) => {
    return isBackImage
      ? pokemon?.sprites?.back_default || ""
      : pokemon?.sprites?.front_default || "";
  };

  // Function to handle the start of the battle when the button is clicked
  const initiateBattle = () => {
    setBattleInitiated(true); // Trigger the countdown and start the battle
  };

  // Get the HP bar color based on the health percentage
  const getHPBarColor = (health, maxHealth) => {
    const percentage = (health / maxHealth) * 100;
    if (percentage > 70) {
      return "bg-green-500"; // High HP
    } else if (percentage > 30) {
      return "bg-yellow-500"; // Medium HP
    } else {
      return "bg-red-500"; // Low HP
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${battleGrounds})` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* CSS styles for the animation */}
        <style>
          {`
            @keyframes bounce-slow {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-15px);
              }
            }

            .animate-bounce-slow {
              animation: bounce-slow 2s infinite;
            }
          `}
        </style>

        {/* Start Battle Button */}
        {!battleInitiated && (
          <button
            onClick={initiateBattle}
            className="bg-red-700 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-red-800 transition"
          >
            Start Battle
          </button>
        )}

        {/* Countdown */}
        {battleInitiated && counter > 0 && (
          <span className="countdown font-bold italic text-[400px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            {counter}
          </span>
        )}

        {/* V/S in center when battle starts */}
        {battleInitiated && counter === 0 && (
          <div className="absolute text-7xl font-bold text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
            V/S
          </div>
        )}

        {/* Player's Pokemon */}
        {playerPokemon && enemyPokemon && counter === 0 && (
          <>
            <div className="flex flex-col items-start absolute bottom-48 left-[250px] animate-bounce-slow">
              <img
                src={getPokemonImageUrl(playerPokemon, true)}
                alt={playerPokemon.name}
                className="h-96"
              />
              <div className="mt-4 w-full flex flex-col items-start">
                {/* Custom HP Bar */}
                <div className="relative w-56 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${getHPBarColor(
                      playerHealth,
                      playerPokemon.stats[0].base_stat
                    )} h-full transition-all duration-500`}
                    style={{
                      width: `${(playerHealth / playerPokemon.stats[0].base_stat) * 100}%`,
                    }}
                  ></div>
                  <span className="absolute inset-0 flex justify-center items-center text-white text-xs font-bold">
                    {playerHealth}/{playerPokemon.stats[0].base_stat}
                  </span>
                </div>
                <h2 className="text-xl text-white font-medium capitalize">
                  {playerPokemon.name}
                </h2>
              </div>
            </div>

            {/* Enemy's Pokemon */}
            <div className="flex flex-col items-end absolute bottom-96 right-[250px] animate-bounce-slow">
              <img
                src={getPokemonImageUrl(enemyPokemon)}
                alt={enemyPokemon.name}
                className="h-96"
              />
              <div className="mt-4 w-full flex flex-col items-end">
                {/* Custom HP Bar */}
                <div className="relative w-56 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${getHPBarColor(
                      enemyHealth,
                      enemyPokemon.stats[0].base_stat
                    )} h-full transition-all duration-500`}
                    style={{
                      width: `${(enemyHealth / enemyPokemon.stats[0].base_stat) * 100}%`,
                    }}
                  ></div>
                  <span className="absolute inset-0 flex justify-center items-center text-white text-xs font-bold">
                    {enemyHealth}/{enemyPokemon.stats[0].base_stat}
                  </span>
                </div>
                <h2 className="text-xl text-white font-medium capitalize">
                  {enemyPokemon.name}
                </h2>
              </div>
            </div>
          </>
        )}

        {/* Show result modal */}
        {openModal && (
          <FightResultModal winner={winner} playerPokemon={playerPokemon} />
        )}
      </div>
    </div>
  );
};

export default BattlePage;
