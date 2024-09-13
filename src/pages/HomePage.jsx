import React, { useState, useEffect } from "react";
import PokemonCategory from "./PokemonCategory";  // Component for displaying Pokémon categories
import axios from "axios";  // HTTP client for making API requests
import { Link } from "react-router-dom";  // React Router for navigation

const HomePage = () => {
  // State to store all Pokémon data
  const [allPokemonData, setAllPokemonData] = useState([]);
  // State to store Pokémon filtered by category or search
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  // State to store selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // State to store the search term
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect hook to fetch all Pokémon data when the component is mounted
  useEffect(() => {
    const fetchAllPokemonData = async () => {
      try {
        // Fetch the first 500 Pokémon from the PokeAPI
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
        const data = await response.json();
        // Store the results in state
        setAllPokemonData(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    // Call the function to fetch data
    fetchAllPokemonData();
  }, []);  // Empty dependency array to ensure it runs once when the component is mounted

  // Function to handle category selection
  const handleCategoryClick = async (category) => {
    if (category === "all") {
      // If "all" is clicked, reset categories and filtered Pokémon
      setSelectedCategories([]);
      setFilteredPokemon([]);
      return;
    }

    // Update the selected categories based on current selection
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)  // Deselect category if already selected
      : [...selectedCategories, category];  // Add category to the selection if not selected

    setSelectedCategories(updatedSelectedCategories);

    if (updatedSelectedCategories.length === 0) {
      // If no categories are selected, reset filtered Pokémon
      setFilteredPokemon([]);
      return;
    }

    try {
      // Fetch data for each selected category using axios
      const promises = updatedSelectedCategories.map((cat) =>
        axios.get(`https://pokeapi.co/api/v2/type/${cat}`)
      );
      const responses = await Promise.all(promises);  // Wait for all requests to resolve

      // Convert responses into sets of Pokémon names
      const categoryPokemonSets = responses.map((response) =>
        new Set(response.data.pokemon.map((p) => p.pokemon.name))
      );

      // Find the intersection of all category Pokémon (Pokémon present in all selected categories)
      const intersection = categoryPokemonSets.reduce((acc, curr) =>
        new Set([...acc].filter((x) => curr.has(x)))
      );

      // Filter the allPokemonData list to match the Pokémon in the intersection set
      const filtered = allPokemonData.filter((pokemon) =>
        intersection.has(pokemon.name)
      );

      // Update the filtered Pokémon state
      setFilteredPokemon(filtered);
    } catch (error) {
      console.error("Error fetching Pokémon by categories:", error.message);
    }
  };

  // Function to handle search input change
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // If the search term is empty, reset the filtered Pokémon
      setFilteredPokemon(selectedCategories.length === 0 ? allPokemonData : filteredPokemon);
    } else {
      // Filter Pokémon by name based on the search term
      const filteredBySearch = allPokemonData.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(term)
      );
      setFilteredPokemon(filteredBySearch);
    }
  };

  // Helper function to get Pokémon image URL based on ID
  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  // Determine the Pokémon list to display (filtered or all)
  const pokemonToDisplay =
    searchTerm === "" && selectedCategories.length === 0 ? allPokemonData : filteredPokemon;

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-red-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Pokémon Battle</div>
          <div className="space-x-4">
            {/* Navigation Links */}
            <Link to="/" className="hover:bg-red-400 px-3 py-2 rounded transition">Home</Link>
            <Link to="/myroster" className="hover:bg-red-400 px-3 py-2 rounded transition">My Roster</Link>
            <Link to="/battle" className="hover:bg-red-400 px-3 py-2 rounded transition">Battle</Link>
            <Link to="/leaderboard" className="hover:bg-red-400 px-3 py-2 rounded transition">Leaderboard</Link>
          </div>
        </div>
      </nav>

      <div className="bg-white py-2 gap-4">
        {/* Pokémon Category Selector Component */}
        <PokemonCategory selectedCategories={selectedCategories} onCategoryClick={handleCategoryClick} />

        {/* Search Bar */}
        <div className="container mx-auto mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Pokémon by name..."
            className="w-full p-2 border rounded shadow"
          />
        </div>

        {/* Pokémon Grid */}
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {pokemonToDisplay.map((pokemon) => (
            <div key={pokemon.name} className="bg-red-100 p-4 rounded shadow">
              {/* Display Pokémon name */}
              <h2 className="text-xl font-semibold text-red-500 capitalize">{pokemon.name}</h2>
              {/* Display Pokémon image */}
              <img
                src={getPokemonImageUrl(pokemon.url.split("/")[6])}
                alt={`${pokemon.name} sprite`}
                className="w-full h-40 object-contain mx-auto"
              />
              <div className="mt-3 space-x-3">
                {/* Action buttons for each Pokémon */}
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
