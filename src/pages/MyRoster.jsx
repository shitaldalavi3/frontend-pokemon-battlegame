import React, { useState, useEffect } from "react";

const MyRoster = () => {
  const [roster, setRoster] = useState([]);
  const [pokemonData, setPokemonData] = useState({});

  useEffect(() => {
    // Load the roster from localStorage when the component mounts
    const storedRoster = JSON.parse(localStorage.getItem("roster")) || [];
    setRoster(storedRoster);

    // Fetch details for each Pokémon in the roster
    const fetchPokemonData = async () => {
      const pokemonDetails = {};
      for (const name of storedRoster) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        pokemonDetails[name] = data; // Store Pokémon data keyed by name
      }
      setPokemonData(pokemonDetails);
    };

    fetchPokemonData();
  }, []);

  // Function to get Pokémon image URL based on name
  const getPokemonImageUrl = (name) => {
    if (pokemonData[name]) {
      return pokemonData[name].sprites.front_default; // Fetch from stored data
    }
    return "";
  };

  // Function to remove Pokémon from the roster
  const removePokemonFromRoster = (pokemon) => {
    const updatedRoster = roster.filter((p) => p !== pokemon);
    setRoster(updatedRoster);
    localStorage.setItem("roster", JSON.stringify(updatedRoster));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">My Roster</h1>
        {roster.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {roster.map((pokemon, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded shadow flex items-center justify-between"
              >
                <div className="flex items-center">
                  {/* Display Pokémon image */}
                  <img
                    src={getPokemonImageUrl(pokemon)}
                    alt={`${pokemon} sprite`}
                    className="w-24 h-24 object-contain mr-4"
                  />
                  <span className="text-lg capitalize">{pokemon}</span>
                </div>
                <button
                  onClick={() => removePokemonFromRoster(pokemon)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Your roster is empty. Go back to the homepage to add Pokémon!</p>
        )}
      </div>
    </div>
  );
};

export default MyRoster;
