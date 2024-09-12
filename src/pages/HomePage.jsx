import React, { useState, useEffect } from "react";
import PokemonCategory from "./PokemonCategory";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [allPokemonData, setAllPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchAllPokemonData = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
        const data = await response.json();
        setAllPokemonData(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchAllPokemonData();
  }, []);

  const handleCategoryClick = async (category) => {
    if (category === "all") {
      setSelectedCategories([]);
      setFilteredPokemon([]);
      return;
    }

    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedSelectedCategories);

    if (updatedSelectedCategories.length === 0) {
      setFilteredPokemon([]);
      return;
    }

    try {
      const promises = updatedSelectedCategories.map((cat) =>
        axios.get(`https://pokeapi.co/api/v2/type/${cat}`)
      );
      const responses = await Promise.all(promises);

      const categoryPokemonSets = responses.map((response) =>
        new Set(response.data.pokemon.map((p) => p.pokemon.name))
      );

      const intersection = categoryPokemonSets.reduce((acc, curr) =>
        new Set([...acc].filter((x) => curr.has(x)))
      );

      const filtered = allPokemonData.filter((pokemon) =>
        intersection.has(pokemon.name)
      );

      setFilteredPokemon(filtered);
    } catch (error) {
      console.error("Error fetching Pokémon by categories:", error.message);
    }
  };

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  const pokemonToDisplay = selectedCategories.length === 0 ? allPokemonData : filteredPokemon;

  return (
    <>
      <nav className="bg-red-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Pokémon Battle</div>
          <div className="space-x-4">
            <Link to="/" className="hover:bg-red-400 px-3 py-2 rounded transition">Home</Link>
            <Link to="/myroster" className="hover:bg-red-400 px-3 py-2 rounded transition">My Roster</Link>
            <Link to="/battle" className="hover:bg-red-400 px-3 py-2 rounded transition">Battle</Link>
            <Link to="/leaderboard" className="hover:bg-red-400 px-3 py-2 rounded transition">Leaderboard</Link>
          </div>
        </div>
      </nav>

      <div className="bg-white py-2 gap-4">
        <PokemonCategory selectedCategories={selectedCategories} onCategoryClick={handleCategoryClick} />
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {pokemonToDisplay.map((pokemon) => (
            <div key={pokemon.name} className="bg-red-100 p-4 rounded shadow">
              <h2 className="text-xl font-semibold text-red-500 capitalize">{pokemon.name}</h2>
              <img
                src={getPokemonImageUrl(pokemon.url.split("/")[6])}
                alt={`${pokemon.name} sprite`}
                className="w-full h-40 object-contain mx-auto"
              />
              <div className="mt-3 space-x-3">
                <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-400 transition">Play</button>
                <Link to={`/pokemon/${pokemon.name}`}>
                  <button className="bg-red-300 text-white px-4 py-2 rounded shadow hover:bg-red-200 transition">More Details</button>
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
