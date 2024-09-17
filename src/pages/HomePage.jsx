import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PokemonCategory from "./PokemonCategory";
import PokemonDetailsModal from "./PokemonDetailsModal";

// Import background images for different Pokémon types
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
import electricbg from "../assets/card_bg/elctric_bg.png";
import psychicbg from "../assets/card_bg/psychic_bg.jpg";
import icebg from "../assets/card_bg/ice_bg.png";
import dragonbg from "../assets/card_bg/dragon_bg.jpg";
import darkbg from "../assets/card_bg/dark_bg.jpg";
import fairybg from "../assets/card_bg/fairy_bg.png";

// Import the logo for the navbar
import logo from "../assets/image/Design 7.png";

// Import background image for the entire page
import homepageBg from "../assets/image/bg 2.jpeg";

const HomePage = () => {
  const [allPokemonData, setAllPokemonData] = useState([]); // State to store all fetched Pokémon data
  const [displayLimit, setDisplayLimit] = useState(30); // Display limit for the number of Pokémon shown at first
  const [filteredPokemon, setFilteredPokemon] = useState([]); // State for filtered Pokémon based on search or category
  const [selectedCategories, setSelectedCategories] = useState([]); // State to store selected categories
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [selectedPokemon, setSelectedPokemon] = useState(null); // State to store selected Pokémon for modal display
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [username, setUsername] = useState(""); // State to store username from localStorage
  const [roster, setRoster] = useState([]); // State to store roster Pokémon
  const navigate = useNavigate(); // Hook for navigation

  // Fetch detailed Pokémon data for each Pokémon
  const fetchPokemonDetails = async (pokemon) => {
    try {
      const response = await axios.get(pokemon.url);
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
      return null;
    }
  };

  // Fetch all Pokémon data when the component mounts
  useEffect(() => {
    const storedUsername = JSON.parse(localStorage.getItem("username"));
    if (!storedUsername) {
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
        const detailedPokemonData = await Promise.all(
          data.results.map(fetchPokemonDetails)
        );
        setAllPokemonData(detailedPokemonData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    // Load roster from localStorage
    const storedRoster = JSON.parse(localStorage.getItem("roster")) || [];
    setRoster(storedRoster);

    fetchAllPokemonData();
  }, [navigate]);

  // Handle category filtering
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

  // Handle search input
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

  // Add Pokémon to the roster
  const addPokemonToRoster = (pokemon) => {
    if (!roster.includes(pokemon)) {
      const updatedRoster = [...roster, pokemon];
      setRoster(updatedRoster);
      localStorage.setItem("roster", JSON.stringify(updatedRoster));
      alert(`${pokemon} has been added to your roster!`);
    } else {
      alert(`${pokemon} is already in your roster!`);
    }
  };

  // Open Pokémon details modal
  const handleCardClick = async (pokemon) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      setSelectedPokemon(response.data);
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  // Navigate to the battle page with the selected Pokémon
  const handlePlay = (pokemon) => {
    navigate("/battle", { state: { selectedPokemon: pokemon } });
  };

  // Background image map for Pokémon types
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
      return { backgroundColor: "#f0f0f0" };
    }
    const firstType = pokemon.types[0]?.type?.name;
    return {
      backgroundImage: `url(${bgImageMap[firstType]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  // Get Pokémon image URL
  const getPokemonImageUrl = (pokemon) => {
    return (
      pokemon?.sprites?.other?.dream_world?.front_default ||
      "path/to/placeholder.png"
    );
  };

  // Load more Pokémon on button click
  const handleLoadMore = () => {
    setDisplayLimit(displayLimit + 30);
  };

  // Determine Pokémon to display based on search, categories, and display limit
  const pokemonToDisplay =
    searchTerm === "" && selectedCategories.length === 0
      ? allPokemonData.slice(0, displayLimit)
      : filteredPokemon.slice(0, displayLimit);

  return (
    <>
      {/* Navigation Bar */}
      <div
        className="sticky top-0 z-10 bg-red-700 p-5 w-full"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.9)" }}
      >
        <div className="flex items-center justify-between">
          <div className="w-auto self-start text-sm">
            <Link to="/">
              <span className="text-white">Exit </span>
              <span className="font-semibold text-white">{username}</span>
            </Link>
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link to="/home">
              <img
                src={logo}
                alt="Pokemon dul arena "
                className="w-[300px] h-auto"
              />
            </Link>
          </div>

          <div className="w-auto text-white text-right">
            <div>
              Welcome, <span className="font-bold text-white">{username}</span>
            </div>
            <div className="mt-2 flex space-x-4">
              <Link
                to="/myroster"
                className="bg-black text-white p-2 pl-5 pr-5 rounded-full inline-block transition animate-fire"
              >
                My Roster
              </Link>
              <Link
                to="/leaderboard"
                className="bg-black text-white p-2 pl-5 pr-5 rounded-full inline-block transition animate-fire"
              >
                Score
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Background */}
      <div
        className="min-h-screen flex"
        style={{
          backgroundImage: `url(${homepageBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Sidebar for categories */}
        <div className="w-1/6 sticky top-0">
          <div className="mx-auto mb-4 mt-32 ml-10">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Pokémon by name..."
              className="w-72 max-w-md p-3 mr-8 border-2 border-black rounded-2xl bg-red-500 bg-opacity-50 text-white mb-4"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <PokemonCategory
              selectedCategories={selectedCategories}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>

        {/* Pokémon Grid */}
        <div className="w-5/6 mt-28 overflow-y-auto h-[80vh] p-5">
          <h2 className="text-3xl font-semibold text-white capitalize mt-3 mb-3">
            All Pokemon
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-4">
            {pokemonToDisplay.map((pokemon) => (
              <div
                key={pokemon.name}
                className="p-4 rounded shadow pokemon-card"
                style={getBackgroundStyle(pokemon)}
                onClick={() => handleCardClick(pokemon)} // Add the onClick event here
              >
                {/* Pokémon Name */}
                <h2 className="text-xl font-semibold text-white capitalize">
                  {pokemon.name}
                </h2>

                {/* Pokémon Types */}
                <div className="flex justify-start mt-3">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.type.name}
                      className="bg-white bg-opacity-40 text-black px-2 py-1 rounded-lg mx-1 text-sm"
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
                {/* Pokémon Image */}
                <img
                  src={getPokemonImageUrl(pokemon)}
                  alt={`${pokemon.name} sprite`}
                  className="w-full h-40 object-contain mx-auto"
                />

                {/* Play and Add to Roster Buttons */}
                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening when clicking Play button
                      handlePlay(pokemon);
                    }}
                    className="bg-red-500 bg-opacity-70 text-white px-3 py-2 rounded-xl shadow hover:bg-red-700 transition"
                  >
                    Play
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening when clicking Add to Roster button
                      addPokemonToRoster(pokemon.name);
                    }}
                    className={`${
                      roster.includes(pokemon.name)
                        ? "bg-gray-500"
                        : "bg-red-500 hover:bg-red-700"
                    } text-white px-3 py-2 rounded-xl shadow transition`}
                  >
                    {roster.includes(pokemon.name)
                      ? "Added to Roster"
                      : "Add to Roster"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {displayLimit < allPokemonData.length && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="bg-red-700 text-white px-6 py-2 rounded-full shadow hover:bg-white hover:text-black transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Pokémon details */}
      {isModalOpen && (
        <PokemonDetailsModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </>
  );
};

export default HomePage;
