import React, { useState, useEffect } from "react";

function BattlePage() {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [result, setResult] = useState("");
  const [roster, setRoster] = useState([]);
  const [pokemonData, setPokemonData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
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
  }, []);

  const getRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json();
  };

  const startBattle = async () => {
    if (!playerPokemon) {
      alert("Please select a Pokémon to battle with.");
      return;
    }

    const enemy = await getRandomPokemon();
    setEnemyPokemon(enemy);

    if (playerPokemon.stats[0].base_stat > enemy.stats[0].base_stat) {
      setResult("You win!");
    } else if (playerPokemon.stats[0].base_stat < enemy.stats[0].base_stat) {
      setResult("You lose!");
    } else {
      setResult("It's a tie!");
    }
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
              <strong>Base Stat:</strong> {playerPokemon.stats[0].base_stat}
            </p>
          </div>
        )}
      </div>

      {playerPokemon && !enemyPokemon && (
        <button onClick={startBattle} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Start Battle
        </button>
      )}

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
              <p>
                <strong>Name:</strong> {playerPokemon.name}
              </p>
              <p>
                <strong>Base Stat:</strong> {playerPokemon.stats[0].base_stat}
              </p>
            </div>

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
                <strong>Base Stat:</strong> {enemyPokemon.stats[0].base_stat}
              </p>
            </div>
          </>
        )}
      </div>

      {enemyPokemon && <div className="mt-4 text-lg font-bold text-center">{result}</div>}
    </div>
  );
}

export default BattlePage;
