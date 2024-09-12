import React, { useState, useEffect } from "react";
import PokemonCategory from "./PokemonCategory";
import axios from "axios";

const HomePage = () => {
  const [allPokemonData, setAllPokemonData] = useState([]); // For all Pokémon
  const [filteredPokemon, setFilteredPokemon] = useState([]); // For Pokémon filtered by categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories

  // Fetch all Pokémon on initial load
  useEffect(() => {
    const fetchAllPokemonData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=200"
        );
        const data = await response.json();
        setAllPokemonData(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchAllPokemonData();
  }, []);

  // Fetch Pokémon by selected categories and find intersection
  const handleCategoryClick = async (category) => {
    if (category === "all") {
      // If "All" is clicked, reset to show all Pokémon
      setSelectedCategories([]);
      setFilteredPokemon([]);
      return;
    }

    // Toggle category selection
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedSelectedCategories);

    if (updatedSelectedCategories.length === 0) {
      // Show all Pokémon if no categories are selected
      setFilteredPokemon([]);
      return;
    }

    try {
      // Fetch Pokémon for each selected category
      const promises = updatedSelectedCategories.map((cat) =>
        axios.get(`https://pokeapi.co/api/v2/type/${cat}`)
      );
      const responses = await Promise.all(promises);

      // Create a Set of Pokémon names for each category
      const categoryPokemonSets = responses.map((response) =>
        new Set(response.data.pokemon.map((p) => p.pokemon.name))
      );

      // Find intersection of all Sets
      const intersection = categoryPokemonSets.reduce((acc, curr) =>
        new Set([...acc].filter((x) => curr.has(x)))
      );

      // Filter all Pokémon data to include only those in the intersection
      const filtered = allPokemonData.filter((pokemon) =>
        intersection.has(pokemon.name)
      );

      setFilteredPokemon(filtered);
    } catch (error) {
      console.error("Error fetching Pokémon by categories:", error.message);
    }
  };

  // Helper function to get Pokémon image URL
  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  // Decide which Pokémon to display: filtered by category or all
  const pokemonToDisplay =
    selectedCategories.length === 0 ? allPokemonData : filteredPokemon;

  return (
    <>
      <nav className="bg-red-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Pokémon Battle</div>
          <div className="space-x-4">
            <button className="hover:bg-red-400 px-3 py-2 rounded transition">
              Home
            </button>
            <button className="hover:bg-red-400 px-3 py-2 rounded transition">
              My Roster
            </button>
            <button className="hover:bg-red-400 px-3 py-2 rounded transition">
              Battle
            </button>
            <button className="hover:bg-red-400 px-3 py-2 rounded transition">
              Leaderboard
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-white py-2 gap-4 ">
        {/* Pass the selectedCategories and handleCategoryClick to PokemonCategory */}
        <PokemonCategory
          selectedCategories={selectedCategories}
          onCategoryClick={handleCategoryClick}
        />
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {pokemonToDisplay.map((pokemon) => (
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
                <button className="bg-red-300 text-white px-4 py-2 rounded shadow hover:bg-red-200 transition">
                  More Details
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