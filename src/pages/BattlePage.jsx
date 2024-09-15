// src/pages/BattlePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BattlePage = () => {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [result, setResult] = useState("");
  const [roster, setRoster] = useState([]);
  const [pokemonData, setPokemonData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if username exists, otherwise redirect to signup
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/signup");
      return;
    }

    const storedRoster = JSON.parse(localStorage.getItem("roster")) || [];
    setRoster(storedRoster);

    const fetchPokemonData = async () => {
      const pokemonDetails = {};
      for (const name of storedRoster) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        pokemonDetails[name] = data;
      }
      setPokemonData(pokemonDetails);
    };

    fetchPokemonData();
  }, [navigate]);

  const getRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json();
  };

  const calculateTotalStats = (pokemon) => {
    if (!pokemon || !pokemon.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  const updateScore = async (battleResult) => {
    let scoreChange = 0;
    let won = 0;
    let lost = 0;

    if (battleResult === "You win!") {
      scoreChange = 10;
      won = 1;
    } else if (battleResult === "You lose!") {
      scoreChange = -5;
      lost = 1;
    }

    const battles = 1;
    const username = JSON.parse(localStorage.getItem("username"));

    try {
      const response = await fetch("http://localhost:8080/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score: scoreChange, battles, won, lost }),
      });

      if (!response.ok) {
        throw new Error("Failed to update score");
      }

      const data = await response.json();
      console.log("Score updated successfully:", data);
    } catch (error) {
      console.error("Error updating score:", error);
    }
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

    await updateScore(battleResult);
  };

  const getPokemonImageUrl = (pokemon) => {
    if (pokemonData[pokemon]) {
      return pokemonData[pokemon].sprites.front_default;
    }
    return "";
  };

  const handlePokemonSelect = (pokemon) => {
    setPlayerPokemon(pokemonData[pokemon]);
    setDropdownOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Battle Page</h1>

      {/* Pokémon Selection Section */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Select Your Pokémon:</label>
        <div className="relative inline-block w-full">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight flex items-center justify-between"
          >
            <span>{playerPokemon ? playerPokemon.name : "Choose a Pokémon"}</span>
            <svg
              className={`fill-current h-4 w-4 transform ${dropdownOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M0 0l10 10 10-10H0z" />
            </svg>
          </div>

          {/* Dropdown List */}
          {dropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {roster.map((pokemon, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 flex items-center p-2"
                  onClick={() => handlePokemonSelect(pokemon)}
                >
                  <img
                    src={getPokemonImageUrl(pokemon)}
                    alt={pokemon}
                    className="w-8 h-8 mr-2"
                  />
                  <span className="capitalize">{pokemon}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Show selected player Pokémon stats and image */}
        {playerPokemon && (
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold">Your Pokémon</h2>
            <img
              src={getPokemonImageUrl(playerPokemon.name)}
              alt={playerPokemon.name}
              className="w-40 h-40 object-contain mx-auto"
            />
            <p><strong>Name:</strong> {playerPokemon.name}</p>
            <p><strong>Stats:</strong></p>
            {playerPokemon.stats.map((stat, index) => (
              <p key={index}>{stat.stat.name}: {stat.base_stat}</p>
            ))}
          </div>
        )}
      </div>

      {/* Start Battle button */}
      {playerPokemon && !enemyPokemon && (
        <button onClick={startBattle} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Start Battle
        </button>
      )}

      {/* Display stats for both player and enemy Pokémon */}
      <div className="flex justify-around">
        {playerPokemon && enemyPokemon && (
          <>
            <div className="text-center">
              <h2 className="text-xl font-bold">Your Pokémon</h2>
              <img
                src={getPokemonImageUrl(playerPokemon.name)}
                alt={playerPokemon.name}
                className="w-40 h-40 object-contain mx-auto"
              />
              <p><strong>Name:</strong> {playerPokemon.name}</p>
              <p><strong>Total Stats:</strong> {calculateTotalStats(playerPokemon)}</p>
              {playerPokemon.stats.map((stat, index) => (
                <p key={index}>{stat.stat.name}: {stat.base_stat}</p>
              ))}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold">Enemy Pokémon</h2>
              <img
                src={enemyPokemon.sprites.front_default}
                alt={enemyPokemon.name}
                className="w-40 h-40 object-contain mx-auto"
              />
              <p><strong>Name:</strong> {enemyPokemon.name}</p>
              <p><strong>Total Stats:</strong> {calculateTotalStats(enemyPokemon)}</p>
              {enemyPokemon.stats.map((stat, index) => (
                <p key={index}>{stat.stat.name}: {stat.base_stat}</p>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Show the battle result */}
      {enemyPokemon && <div className="mt-4 text-lg font-bold text-center">{result}</div>}
    </div>
  );
};

export default BattlePage;
