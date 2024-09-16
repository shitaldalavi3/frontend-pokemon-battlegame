import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PokemonCategory from "./PokemonCategory";
import PokemonDetailsModal from "./PokemonDetailsModal";
import MyRoster from "./MyRoster";
import BattlePage from "./BattlePage";

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

// Import background image for the entire page (if you're using an image as the background)
import homepageBg from "../assets/image/background.jpeg"; // Make sure to replace this with your actual path

const HomePage = () => {
  const [allPokemonData, setAllPokemonData] = useState([]); // Stores all fetched Pokémon data
  const [displayLimit, setDisplayLimit] = useState(30); // Controls how many Pokémon are displayed at first
  const [filteredPokemon, setFilteredPokemon] = useState([]); // Stores filtered Pokémon based on search or category
  const [selectedCategories, setSelectedCategories] = useState([]); // Stores selected categories
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search input
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Pokémon selected to view in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls whether modal is open or not
  const [username, setUsername] = useState(""); // Stores username from localStorage
  const [roster, setRoster] = useState([]); // Roster for added Pokémon
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

        setAllPokemonData(data.results);

        const detailedPokemonData = await Promise.all(
          data.results.map(fetchPokemonDetails)
        );
        setAllPokemonData(detailedPokemonData.filter(Boolean)); // Filter out any failed requests
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    // Load roster from localStorage
    const storedRoster = JSON.parse(localStorage.getItem("roster")) || [];
    setRoster(storedRoster);

    fetchAllPokemonData();
  }, [navigate]);

  // Function to handle category click for filtering Pokémon by type
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

  // Function to add Pokémon to the roster
  const addPokemonToRoster = (pokemon) => {
    if (!roster.includes(pokemon)) {
      const updatedRoster = [...roster, pokemon];
      setRoster(updatedRoster);
      localStorage.setItem("roster", JSON.stringify(updatedRoster));
      alert(`${pokemon} has been added to your roster!`); // Alert message after adding
    } else {
      alert(`${pokemon} is already in your roster!`); // Alert message if Pokémon is already added
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
      return { backgroundColor: "#f0f0f0" }; // Default background if no type data is available
    }

    const firstType = pokemon.types[0]?.type?.name;

    // Return background image style for the first type
    return {
      backgroundImage: `url(${bgImageMap[firstType]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  const getPokemonImageUrl = (pokemon) => {
    // Fallback in case dream_world sprite is not available
    return (
      pokemon?.sprites?.other?.dream_world?.front_default ||
      "path/to/placeholder.png"
    );
  };

  // Function to handle "Load More" button click
  const handleLoadMore = () => {
    setDisplayLimit(displayLimit + 30); // Increase the display limit by 30
  };

  // Determine which Pokémon to display based on search term, selected categories, and display limit
  const pokemonToDisplay =
    searchTerm === "" && selectedCategories.length === 0
      ? allPokemonData.slice(0, displayLimit) // Show up to the current display limit
      : filteredPokemon.slice(0, displayLimit); // Apply limit to filtered Pokémon

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
              <img src={logo} alt="Pokemon dul arena " className="w-[300px] h-auto" />
            </Link>
          </div>

          <div className="w-auto text-white text-right">
            <div>
              Hello,{" "}
              <span className="font-bold text-white">{username}</span>
            </div>
            <div className="mt-2 flex space-x-4 ">
              <Link
                to="/myroster"
                className="bg-black text-white p-2 pl-5 pr-5  rounded-full inline-block transition animate-fire"
              >
                My Roster
              </Link>
              <Link
                to="/leaderboard"
                className=" bg-black text-white p-2 pl-5 pr-5  rounded-full inline-block transition animate-fire"
              >
                Score
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Background */}
      <div className="bg-cover bg-black bg-center bg-no-repeat min-h-screen">
        <div className=" py-2 flex gap-2 max-w-full mx-auto px-2">
          {/* Sidebar for categories */}
          <div className="w-1/6">
            {/* Move the search bar above categories */}
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

          {/* Pokémon grid */}
          <div className="w-5/6 mt-28">
          <h2 className="text-3xl font-semibold text-white capitalize mt-3 mb-3">
                   All Pokemon
                  </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-4">
              {pokemonToDisplay.map((pokemon) => (
                <div
                  key={pokemon.name}
                  className="p-4 rounded shadow pokemon-card"
                  style={getBackgroundStyle(pokemon)}
                  onClick={() => handleCardClick(pokemon)} // Added onClick to the card
                >
                  <h2 className="text-xl font-semibold text-white capitalize">
                    {pokemon.name}
                  </h2>
                  <img
                    src={getPokemonImageUrl(pokemon)}
                    alt={`${pokemon.name} sprite`}
                    className="w-full h-40 object-contain mx-auto"
                  />
                  <div className="mt-5 flex justify-end space-x-3">
                    <button className="bg-red-500  bg-opacity-70 text-white px-3 py-2 rounded-xl shadow hover:bg-red-700 transition">
                      Play
                    </button>
                    <button
                      onClick={() => addPokemonToRoster(pokemon.name)}
                      className={`${
                        roster.includes(pokemon.name)
                          ? "bg-gray-500"
                          : "bg-red-500 hover:bg-red-700"
                      } text-white px-3 py-2 rounded-xl shadow transition`}
                    >
                      {roster.includes(pokemon.name) ? "Added to Roster" : "Add to Roster"}
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
      </div>
      {isModalOpen && (
        <PokemonDetailsModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </>
  );
};

export default HomePage;
