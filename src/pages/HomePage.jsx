import React, { useState, useEffect } from "react";
import PokemonCategory from "./PokemonCategory"; // Component for displaying Pokémon categories
import axios from "axios"; // HTTP client for making API requests
import PokemonDetailsModal from "./PokemonDetailsModal"; // Import modal component for Pokémon details
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation

// Import card background images based on type
import normalbg from "../assets/card_bg/normal_bgpng.png";
import fightingbg from "../assets/card_bg/fighting_bg.png";
import flyingbg from "../assets/card_bg/flying_bg.png";
import poisonbg from "../assets/card_bg/poison_bg.png";
import groundbg from "../assets/card_bg/ground_bg.jpg";
import rockbg from "../assets/card_bg/rock_bg.png";
import bugbg from "../assets/card_bg/bug_bg.png";
import ghostbg from "../assets/card_bg/ghost_bg.png";
import steelbg from "../assets/card_bg/steel_bg.png";
import firebg from "../assets/card_bg/fire_bg.png";
import waterbg from "../assets/card_bg/water_bg.png";
import grassbg from "../assets/card_bg/grass_bg.jpg";
import electricbg from "../assets/card_bg/bug_bg.png";
import psychicbg from "../assets/card_bg/psychic_bg.jpg";
import icebg from "../assets/card_bg/ice_bg.png";
import dragonbg from "../assets/card_bg/dragon_bg.jpg";
import darkbg from "../assets/card_bg/dark_bg.jpg";
import fairybg from "../assets/card_bg/fairy_bg.png";

const HomePage = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [allPokemonData, setAllPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Fetch detailed Pokémon data for each Pokémon
  const fetchPokemonDetails = async (pokemon) => {
    try {
      const response = await axios.get(pokemon.url); // Fetch details for each Pokémon
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check if username exists in localStorage
    const storedUsername = JSON.parse(localStorage.getItem("username"));
    if (!storedUsername) {
      // If no username, navigate to signup page
      navigate("/signup");
    } else {
      setUsername(storedUsername);
    }

    const fetchAllPokemonData = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=500"
        );
        const data = await response.json();
        setPokemonData(data.results);

        // Fetch detailed data for each Pokémon
        const detailedPokemonData = await Promise.all(
          data.results.map(fetchPokemonDetails)
        );
        setAllPokemonData(detailedPokemonData.filter(Boolean)); // Filter out any failed requests
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchAllPokemonData();
  }, [navigate]);

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

      const categoryPokemonSets = responses.map(
        (response) => new Set(response.data.pokemon.map((p) => p.pokemon.name))
      );

      const intersection = categoryPokemonSets.reduce(
        (acc, curr) => new Set([...acc].filter((x) => curr.has(x)))
      );

      const filtered = allPokemonData.filter((pokemon) =>
        intersection.has(pokemon.name)
      );

      setFilteredPokemon(filtered);
    } catch (error) {
      console.error("Error fetching Pokémon by categories:", error.message);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredPokemon(
        selectedCategories.length === 0 ? allPokemonData : filteredPokemon
      );
    } else {
      const filteredBySearch = allPokemonData.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(term)
      );
      setFilteredPokemon(filteredBySearch);
    }
  };

  const handleCardClick = async (pokemon) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      setSelectedPokemon(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  // Background image mapping for types
  const bgImageMap = {
    normal: normalbg,
    fighting: fightingbg,
    flying: flyingbg,
    poison: poisonbg,
    ground: groundbg,
    rock: rockbg,
    bug: bugbg,
    ghost: ghostbg,
    steel: steelbg,
    fire: firebg,
    water: waterbg,
    grass: grassbg,
    electric: electricbg,
    psychic: psychicbg,
    ice: icebg,
    dragon: dragonbg,
    dark: darkbg,
    fairy: fairybg,
  };

  // Get background style based on the first type of the Pokémon
  const getBackgroundStyle = (pokemon) => {
    if (!pokemon.types || pokemon.types.length === 0) {
      return { backgroundColor: "#f0f0f0" }; // Default background if no type data available
    }

    const firstType = pokemon.types[0]?.type?.name;

    // Apply the background image for the first type only
    return {
      backgroundImage: `url(${bgImageMap[firstType]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  const getPokemonImageUrl = (pokemon) => {
    return pokemon.sprites.other.dream_world.front_default;
  };

  const pokemonToDisplay =
    searchTerm === "" && selectedCategories.length === 0
      ? allPokemonData
      : filteredPokemon;

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-red-500 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Pokémon Battle</div>
          <div className="space-x-4">
            <Link
              to="/"
              className="hover:bg-red-400 px-3 py-2 rounded transition"
            >
              Home
            </Link>
            <Link
              to="/myroster"
              className="hover:bg-red-400 px-3 py-2 rounded transition"
            >
              My Roster
            </Link>
            <Link
              to="/battle"
              className="hover:bg-red-400 px-3 py-2 rounded transition"
            >
              Battle
            </Link>
            <Link
              to="/leaderboard"
              className="hover:bg-red-400 px-3 py-2 rounded transition"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="bg-white py-2 gap-4">
        <PokemonCategory
          selectedCategories={selectedCategories}
          onCategoryClick={handleCategoryClick}
        />

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
            <div
              key={pokemon.name}
              className="p-4 rounded shadow pokemon-card"
              style={getBackgroundStyle(pokemon)} // Set background image based on first type
              onClick={() => handleCardClick(pokemon)}
            >
              <h2 className="text-xl font-semibold text-white capitalize">
                {pokemon.name}
              </h2>
              <img
                src={getPokemonImageUrl(pokemon)}
                alt={`${pokemon.name} sprite`}
                className="w-full h-40 object-contain mx-auto"
              />
              <div className="mt-3 space-x-3">
                <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-400 transition">
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <PokemonDetailsModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </>
  );
};

export default HomePage;
