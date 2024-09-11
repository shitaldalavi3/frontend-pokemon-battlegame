import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
        const data = await response.json();
        setPokemonData(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemonData();
  }, []);

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  return (
    <>
      <nav className="bg-red-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link to="/">Pokémon Battle</Link>
          </div>
          <div className="space-x-4">
            <Link to="/" className="hover:bg-red-400 px-3 py-2 rounded transition">
              Home
            </Link>
            <Link to="/Myroster" className="hover:bg-red-400 px-3 py-2 rounded transition">
              My Roster
            </Link>
            <Link to="/battle" className="hover:bg-red-400 px-3 py-2 rounded transition">
              Battle
            </Link>
            <Link to="/leaderboard" className="hover:bg-red-400 px-3 py-2 rounded transition">
              Leaderboard
            </Link>

          </div>
        </div>
      </nav>

      <div className="bg-white py-8">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {pokemonData.map((pokemon) => (
            <div key={pokemon.name} className="bg-red-100 p-4 rounded shadow">
              <h2 className="text-xl font-semibold text-red-500 capitalize">
                {pokemon.name}
              </h2>
              <img
                src={getPokemonImageUrl(pokemon.url.split("/")[6])}
                alt={`${pokemon.name} sprite`}
                className="w-full h-40 object-contain mx-auto"
              />
              <div className="mt-3 space-x-3">
                <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-400 transition">
                  Play
                </button>
                <Link
                  to={`/pokemon/${pokemon.name}`}
                  className="bg-red-300 text-white px-4 py-2 rounded shadow hover:bg-red-200 transition"
                >
                  More Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
