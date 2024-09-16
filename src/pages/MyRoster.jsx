import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import PokemonDetailsModal from "./PokemonDetailsModal"; // Import your modal component

// Import the logo for the navbar
import logo from "../assets/image/Design 7.png";

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

// Import background image for the entire page
import homepageBg from "../assets/image/bg 2.jpeg";

const MyRoster = () => {
  const [roster, setRoster] = useState([]);
  const [pokemonData, setPokemonData] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(null); // For selected Pokémon details modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [username, setUsername] = useState(""); // State for the username
  const navigate = useNavigate(); // To navigate to battle page

  // Fetch username from localStorage and load roster on component mount
  useEffect(() => {
    const storedUsername = JSON.parse(localStorage.getItem("username"));
    if (storedUsername) {
      setUsername(storedUsername); // Set username if found in localStorage
    }

    const storedRoster = JSON.parse(localStorage.getItem("roster")) || [];
    setRoster(storedRoster);

    // Fetch details for each Pokémon in the roster
    const fetchPokemonData = async () => {
      const pokemonDetails = {};
      for (const name of storedRoster) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const data = await response.json();
        pokemonDetails[name] = data; // Store Pokémon data keyed by name
      }
      setPokemonData(pokemonDetails);
    };

    fetchPokemonData();
  }, []);

  // Function to navigate to the battle page with the selected Pokémon
  const handlePlay = (pokemon) => {
    navigate("/battle", { state: { selectedPokemon: pokemonData[pokemon] } }); // Navigate to battle with selected Pokémon
  };

  // Function to open modal with selected Pokémon details
  const openModal = (pokemon) => {
    setSelectedPokemon(pokemonData[pokemon]);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  // Function to get Pokémon image URL based on name
  const getPokemonImageUrl = (name) => {
    if (pokemonData[name]) {
      return (
        pokemonData[name]?.sprites?.other?.dream_world?.front_default ||
        "path/to/placeholder.png"
      );
    }
    return "";
  };

  // Function to remove Pokémon from the roster
  const removePokemonFromRoster = (pokemon) => {
    if (window.confirm(`Are you sure you want to remove ${pokemon} from your roster?`)) {
      const updatedRoster = roster.filter((p) => p !== pokemon);
      setRoster(updatedRoster);
      localStorage.setItem("roster", JSON.stringify(updatedRoster));
      alert(`${pokemon} has been removed from your roster.`);
    }
  };

  // Function to get background style based on Pokémon type
  const getBackgroundStyle = (pokemon) => {
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

    if (pokemonData[pokemon] && pokemonData[pokemon].types.length > 0) {
      const firstType = pokemonData[pokemon].types[0]?.type?.name;
      return {
        backgroundImage: `url(${bgImageMap[firstType]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    return { backgroundColor: "#f0f0f0" }; // Default background
  };

  return (
    <>
      {/* Navigation Bar */}
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
              <img src={logo} alt="Pokemon duel arena" className="w-[300px] h-auto" />
            </Link>
          </div>

          <div className="w-auto text-white text-right">
            <div>
              Hello, <span className="font-bold text-white">{username}</span>
            </div>
            <div className="mt-2 flex space-x-4 ">
              <Link
                to="/home"
                className="bg-black text-white p-2 pl-5 pr-5 rounded-full inline-block transition animate-fire"
              >
                Home
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

      <div
        className="min-h-screen flex"
        style={{
          backgroundImage: `url(${homepageBg})`,  // Use the background image
          backgroundSize: "cover",               // Ensure the background covers the whole area
          backgroundPosition: "center",          // Center the background
          backgroundRepeat: "no-repeat",         // No repeating of the background image
          backgroundAttachment: "fixed",         // This ensures the background is fixed when scrolling
        }}
      >
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-white mb-6">My Roster</h1>

          {roster.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-4">
              {roster.map((pokemon, index) => (
                <div
                  key={index}
                  className="p-4 rounded shadow pokemon-card"
                  style={getBackgroundStyle(pokemon)}
                  onClick={() => openModal(pokemon)}
                >
                  <h2 className="text-xl font-semibold text-white capitalize">
                    {pokemon}
                  </h2>
                  <img
                    src={getPokemonImageUrl(pokemon)}
                    alt={`${pokemon} sprite`}
                    className="w-full h-40 object-contain mx-auto"
                  />
                  <div className="mt-5 flex justify-end space-x-3">
                    {/* Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the modal when clicking "Play"
                        handlePlay(pokemon); // Navigate to the battle page
                      }}
                      className="bg-red-500 bg-opacity-70 text-white px-3 py-2 rounded-xl shadow hover:bg-red-700 transition"
                    >
                      Play
                    </button>
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the modal when clicking "Remove"
                        removePokemonFromRoster(pokemon);
                      }}
                      className="bg-gray-500 text-white px-3 py-2 rounded-xl shadow hover:bg-gray-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">
              Your roster is empty. Go back to the homepage to add Pokémon!
            </p>
          )}
        </div>
      </div>

      {/* Pokemon Details Modal */}
      {isModalOpen && (
        <PokemonDetailsModal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </>
  );
};

export default MyRoster;
