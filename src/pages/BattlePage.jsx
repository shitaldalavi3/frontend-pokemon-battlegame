import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FightResultModal from "./FightResultModal";
import battleGrounds from "../assets/image/bg 4.jpeg"; // Replace with the correct background image path

const BattlePage = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || null; // Retrieve selected Pokemon from state
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [playerHealth, setPlayerHealth] = useState(0);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [fightStarted, setFightStarted] = useState(false);
  const [fightEnded, setFightEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [counter, setCounter] = useState(3);
  const [openModal, setOpenModal] = useState(false);

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

  // Start the countdown and battle
  useEffect(() => {
    if (counter > 0) {
      const countdownInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else if (counter === 0) {
      startBattle();
    }
  }, [counter]);

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
          setFightEnded(true);
          setWinner(playerPokemon);
        }
        return newHealth;
      });

      setPlayerHealth((prev) => {
        const newHealth = Math.max(prev - damageToPlayer, 0);
        if (newHealth <= 0) {
          clearInterval(battleInterval);
          setFightEnded(true);
          setWinner(enemy);
        }
        return newHealth;
      });
    }, 1000);
  };

  // Show result modal after the battle ends
  useEffect(() => {
    if (fightEnded) {
      setTimeout(() => {
        setOpenModal(true);
      }, 2000);
    }
  }, [fightEnded]);

  const getPokemonImageUrl = (pokemon, isBackImage = false) => {
    return isBackImage
      ? pokemon?.sprites?.back_default || ""
      : pokemon?.sprites?.front_default || "";
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${battleGrounds})` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Countdown */}
        {counter > 0 && (
          <span className="countdown font-bold italic text-[400px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            {counter}
          </span>
        )}

        {/* Player's Pokemon */}
        {playerPokemon && enemyPokemon && counter === 0 && (
          <>
            <div className="flex flex-col items-start absolute bottom-20 left-40">
              <img
                src={getPokemonImageUrl(playerPokemon, true)}
                alt={playerPokemon.name}
                className="h-64"
              />
              <div className="mt-4 w-full flex flex-col items-start">
                <div className="flex gap-2 items-center w-full justify-end">
                  <progress
                    className="progress progress-error w-56 bg-white"
                    value={playerHealth}
                    max={playerPokemon.stats[0].base_stat}
                  ></progress>
                  <span className="font-medium text-white">HP</span>
                </div>
                <h2 className="text-xl text-white font-medium capitalize">
                  {playerPokemon.name}
                </h2>
              </div>
            </div>

            {/* Enemy's Pokemon */}
            <div className="flex flex-col items-end absolute bottom-20 right-40">
              <img
                src={getPokemonImageUrl(enemyPokemon)}
                alt={enemyPokemon.name}
                className="h-64"
              />
              <div className="mt-4 w-full flex flex-col items-end">
                <div className="flex gap-2 items-center w-full justify-end">
                  <span className="font-medium text-white">HP</span>
                  <progress
                    className="progress progress-error w-56 bg-white"
                    value={enemyHealth}
                    max={enemyPokemon.stats[0].base_stat}
                  ></progress>
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
