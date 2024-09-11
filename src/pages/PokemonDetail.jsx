import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        setPokemonDetails(data);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  const addPokemonToRoster = () => {
    const roster = JSON.parse(localStorage.getItem("roster")) || [];
    if (!roster.includes(name)) {
      roster.push(name);
      localStorage.setItem("roster", JSON.stringify(roster));
      setIsAdded(true);
      alert(`${name} has been added to your roster!`);
    } else {
      alert(`${name} is already in your roster.`);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8">
        {pokemonDetails ? (
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl font-bold capitalize text-center mb-6">
              {pokemonDetails.name}
            </h1>
            <img
              src={pokemonDetails.sprites.front_default}
              alt={pokemonDetails.name}
              className="w-64 h-64 object-contain mx-auto"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Stats:</h2>
              <ul className="list-disc list-inside">
                {pokemonDetails.stats.map((stat) => (
                  <li key={stat.stat.name} className="capitalize">
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
              <h2 className="text-xl font-semibold mt-4 mb-2">Abilities:</h2>
              <ul className="list-disc list-inside">
                {pokemonDetails.abilities.map((ability) => (
                  <li key={ability.ability.name} className="capitalize">
                    {ability.ability.name}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={addPokemonToRoster}
                  className={`${
                    isAdded ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-400"
                  } text-white px-6 py-2 rounded transition`}
                  disabled={isAdded}
                >
                  {isAdded ? "Added to Roster" : "Add to Roster"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading Pokémon details...</p>
        )}
      </div>
    </div>
  );
};

export default PokemonDetails;
