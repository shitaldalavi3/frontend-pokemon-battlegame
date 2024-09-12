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
    // Retrieve the player's Pokémon roster from local storage
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

    fetchPokemonData(); // Call the function to fetch Pokémon data
  }, []);

  // Function to get a random Pokémon from the API (for the enemy)
  const getRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 898) + 1; // Get random Pokémon ID
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json(); // Return the Pokémon data
  };

  // Function to calculate the total base stats of a Pokémon
  const calculateTotalStats = (pokemon) => {
    if (!pokemon || !pokemon.stats) return 0;

    // Sum up all the base stats (HP, attack, defense, etc.)
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  // Function to start the battle
  const startBattle = async () => {
    // Check if a player Pokémon has been selected
    if (!playerPokemon) {
      alert("Please select a Pokémon to battle with.");
      return;
    }

    // Get a random enemy Pokémon
    const enemy = await getRandomPokemon();
    setEnemyPokemon(enemy); // Set enemy Pokémon state

    // Calculate total stats for both player and enemy Pokémon
    const playerTotalStats = calculateTotalStats(playerPokemon);
    const enemyTotalStats = calculateTotalStats(enemy);

    // Compare the total stats and set the result of the battle
    if (playerTotalStats > enemyTotalStats) {
      setResult("You win!");
    } else if (playerTotalStats < enemyTotalStats) {
      setResult("You lose!");
    } else {
      setResult("It's a tie!");
    }
  };

  // Function to get the image URL for a Pokémon
  const getPokemonImageUrl = (pokemon) => {
    if (pokemonData[pokemon]) {
      return pokemonData[pokemon].sprites.front_default; // Return the sprite image URL
    }
    return "";
  };

  // Function to handle Pokémon selection from the dropdown
  const handlePokemonSelect = (pokemon) => {
    setPlayerPokemon(pokemonData[pokemon]); // Set the selected Pokémon data
    setDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Battle Page</h1>
      
      {/* Pokémon Selection Section */}
      <div className="mb-4">
        <label className="block text-lg font-bold mb-2">Select Your Pokémon:</label>
        <div className="relative inline-block w-full">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
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
              {/* List each Pokémon in the roster */}
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
            <p>
              <strong>Name:</strong> {playerPokemon.name}
            </p>
            <p>
              <strong>Stats:</strong>
            </p>
            {/* Display all stats for the selected Pokémon */}
            {playerPokemon.stats.map((stat, index) => (
              <p key={index}>
                {stat.stat.name}: {stat.base_stat}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Show the "Start Battle" button if a Pokémon is selected but no enemy Pokémon is generated */}
      {playerPokemon && !enemyPokemon && (
        <button onClick={startBattle} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Start Battle
        </button>
      )}

      {/* Display stats for both player and enemy Pokémon */}
      <div className="flex justify-around">
        {playerPokemon && enemyPokemon && (
          <>
            {/* Player's Pokémon */}
            <div className="text-center">
              <h2 className="text-xl font-bold">Your Pokémon</h2>
              <img
                src={getPokemonImageUrl(playerPokemon.name)}
                alt={playerPokemon.name}
                className="w-40 h-40 object-contain mx-auto"
              />
              <p>
                <strong>Name:</strong> {playerPokemon.name}
              </p>
              <p>
                <strong>Total Stats:</strong> {calculateTotalStats(playerPokemon)}
              </p>
              {/* Show all individual stats */}
              {playerPokemon.stats.map((stat, index) => (
                <p key={index}>
                  {stat.stat.name}: {stat.base_stat}
                </p>
              ))}
            </div>

            {/* Enemy's Pokémon */}
            <div className="text-center">
              <h2 className="text-xl font-bold">Enemy Pokémon</h2>
              <img
                src={enemyPokemon.sprites.front_default}
                alt={enemyPokemon.name}
                className="w-40 h-40 object-contain mx-auto"
              />
              <p>
                <strong>Name:</strong> {enemyPokemon.name}
              </p>
              <p>
                <strong>Total Stats:</strong> {calculateTotalStats(enemyPokemon)}
              </p>
              {/* Show all individual stats */}
              {enemyPokemon.stats.map((stat, index) => (
                <p key={index}>
                  {stat.stat.name}: {stat.base_stat}
                </p>
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
