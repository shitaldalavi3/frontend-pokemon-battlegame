import React, { useState, useEffect } from "react";
import axios from "axios"; // Importing axios for API requests

// Define the color map for each type
const bgColorMap = {
  normal: "#BE768A",
  fighting: "#FE6E44",
  flying: "#94B2C7",
  poison: "#A971F0",
  ground: "#D08831",
  rock: "#A43E19",
  bug: "#45A043",
  ghost: "#906791",
  steel: "#1DB07F",
  fire: "#FF5C5C",
  water: "#6DCBFF",
  grass: "#06DA81",
  electric: "#FFDC62",
  psychic: "#F334C9",
  ice: "#ADE3FB",
  dragon: "#62CAD9",
  dark: "#595978",
  fairy: "#FA5295",
  stellar: "#33336B",
  unknown: "#707070",
};

const PokemonCategory = ({ selectedCategories, onCategoryClick }) => {
  const [types, setTypes] = useState([]);

  // Fetch Pokémon types when the component mounts
  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        const data = response.data.results;
        setTypes(data); // Set fetched types
      } catch (error) {
        console.error("Error fetching Pokémon types:", error.message);
      }
    }

    fetchTypes();
  }, []);

  // Helper function to check if a category is selected
  const isCategorySelected = (category) => selectedCategories.includes(category);

  // Helper function to get the background color for a type
  const getTypeBgColor = (type) => bgColorMap[type] || "#000"; // Default to black if type not found

  return (
    <div className="py-4 ml-12 ">
      {/* Header for Categories section */}
      <div className="text-red-500 text-lg font-bold mb-6">
        Filter pokemons by <span className="text-white">type</span>
      </div>

      {/* Container for category buttons */}
      <div className="grid grid-cols-2 gap-8">
        {/* "All" Button */}
        <div>
          <button
            onClick={() => onCategoryClick("all")}
            className={`${
              selectedCategories.length === 0 ? "bg-yellow-500 text-white" : "bg-red-700 text-white"
            } px-4 py-2 rounded-lg w-full transition hover:bg-yellow-500`}
          >
            All
          </button>
        </div>

        {/* Buttons for each Pokémon type */}
        {types.map((type) => (
          <div key={type.name}>
            <button
              onClick={() => onCategoryClick(type.name)}
              className={`px-6 py-2 rounded-lg w-full transition text-white ${
                isCategorySelected(type.name)
                  ? "text-white" // Keep text white for selected state
                  : "text-white" // Keep text white for unselected state
              }`}
              style={{
                backgroundColor: isCategorySelected(type.name)
                  ? getTypeBgColor(type.name) // Background color for selected state
                  : "#C53030", // Default red-700 background for unselected
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = getTypeBgColor(type.name)) // Hover effect to show type color
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = isCategorySelected(type.name)
                  ? getTypeBgColor(type.name) // Keep selected background after hover
                  : "#C53030") // Revert to red-700 if not selected
              }
            >
              {type.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonCategory;
