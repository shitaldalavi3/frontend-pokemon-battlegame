import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BattlePage = () => {
  const location = useLocation();
  const selectedPokemon = location.state?.selectedPokemon || null; // Retrieve selected Pokemon from state
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [result, setResult] = useState("");

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

  const startBattle = async () => {
    if (!playerPokemon) {
      alert("Please select a Pokémon to battle with.");
      return;
    }

    const enemy = await getRandomPokemon();
    setEnemyPokemon(enemy);

    const playerTotalStats = calculateTotalStats(playerPokemon);
    const enemyTotalStats = calculateTotalStats(enemy);

    let battleResult;
    if (playerTotalStats > enemyTotalStats) {
      battleResult = "You win!";
    } else if (playerTotalStats < enemyTotalStats) {
      battleResult = "You lose!";
    } else {
      battleResult = "It's a tie!";
    }

    setResult(battleResult);
  };

  const getPokemonImageUrl = (pokemon) => {
    return pokemon?.sprites?.front_default || "";
  };

  return (
    <div className="p-4 bg-black">
      <h1 className="text-red-700 text-2xl font-bold mb-4 text-center">Battle Page</h1>
      {playerPokemon && (
        <div className="text-red-700 text-center mt-4 bg-black">
          <h2 className="text-red-700 text-xl font-bold">Your Pokémon</h2>
          <img src={getPokemonImageUrl(playerPokemon)} alt={playerPokemon.name} className="w-40 h-40 object-contain mx-auto" />
          <p><strong className="text-red-700">Name:</strong> {playerPokemon.name}</p>
          <button onClick={startBattle} className="bg-red-700 text-white px-4 py-2 rounded mb-4">
            Start Battle
          </button>
        </div>
      )}
      {enemyPokemon && (
        <div className="text-center bg-black">
          <h2 className="text-red-700 text-xl font-bold">Enemy Pokémon</h2>
          <img src={enemyPokemon.sprites.front_default} alt={enemyPokemon.name} className="w-40 h-40 object-contain mx-auto" />
          <p className="text-red-700"><strong>Name:</strong> {enemyPokemon.name}</p>
          <p className="text-red-700"><strong>Total Stats:</strong> {calculateTotalStats(enemyPokemon)}</p>
        </div>
      )}
      {result && (
        <div className="mt-4 text-3xl text-center text-red-700 font-bold">{result}</div>
      )}
    </div>
  );
};

export default BattlePage;
