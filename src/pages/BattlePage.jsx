import React, { useState, useEffect } from "react";

function BattlePage() {
  // State to manage the player's selected Pokémon
  const [playerPokemon, setPlayerPokemon] = useState(null);
  
  // State to manage the enemy Pokémon (randomly selected)
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  
  // State to display the result of the battle
  const [result, setResult] = useState("");
  
  // State to store the player's Pokémon roster (from local storage)
  const [roster, setRoster] = useState([]);
  
  // State to store detailed data for each Pokémon in the roster
  const [pokemonData, setPokemonData] = useState({});
  
  // State to handle the dropdown menu for Pokémon selection
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch the roster from local storage and then fetch Pokémon data
  useEffect(() => {
    const storedRoster = JSON.parse(localStorage.getItem("roster")) || [];
    setRoster(storedRoster);

    // Fetch detailed data for each Pokémon in the roster
    const fetchPokemonData = async () => {
      const pokemonDetails = {};
      for (const name of storedRoster) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        pokemonDetails[name] = data; // Store data keyed by Pokémon name
      }
      setPokemonData(pokemonDetails); // Save fetched data into state
    };

    fetchPokemonData();
  }, []);

  // Function to get a random Pokémon from the API (for the enemy)
  const getRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json();
  };

  // Function to calculate the total base stats of a Pokémon
  const calculateTotalStats = (pokemon) => {
    if (!pokemon || !pokemon.stats) return 0;

    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  // Function to send battle result to the backend and update score
  const updateScore = async (result) => {
    let scoreChange = 0;
    if (result === "You win!") {
      scoreChange = 10;  // Add 10 points for a win
    } else if (result === "You lose!") {
      scoreChange = -5;  // Subtract 5 points for a loss
    } else if (result === "It's a tie!") {
      scoreChange = 2;  // Add 2 points for a tie
    }

    const username = localStorage.getItem("username"); // Assuming username is stored in localStorage
    try {
      const response = await fetch("http://localhost:8080/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score: scoreChange }),
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

  // Function to start the battle
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

    // Update the score based on the result
    await updateScore(battleResult);
  };

  // Function to get the image URL for a Pokémon
  const getPokemonImageUrl = (pokemon) => {
    if (pokemonData[pokemon]) {
      return pokemonData[pokemon].sprites.front_default;
    }
    return "";
  };

  // Function to handle Pokémon selection from the dropdown
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
              <p key={index}>
                {stat.stat.name}: {stat.base_stat}
              </p>
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
}

export default BattlePage;
