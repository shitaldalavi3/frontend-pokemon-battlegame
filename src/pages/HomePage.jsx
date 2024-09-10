import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
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
      <div className="bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {pokemonData.map((pokemon) => (
            <div key={pokemon.name} className="bg-red p-4 rounded shadow">
              <h2 className="text-xl font-semibold text-red-500">
                {pokemon.name}
              </h2>
              {/* <div>{pokemon.url}</div>*/}
              <img
                src={getPokemonImageUrl(pokemon.url.split("/")[6])}
                alt={`${pokemon.name} sprite`}
                className="w-full h-72 object-cover transition-opacity duration-300 group-hover:opacity-40"
              ></img>
              <div className="space-x-3">
                <button className="btn bg-red-500 text-white px-2 py-1 rounded p-3 ">
                  play
                </button>
                <button className="btn bg-red-300 text-white px-2 py-1 rounded p-3">
                  more details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
