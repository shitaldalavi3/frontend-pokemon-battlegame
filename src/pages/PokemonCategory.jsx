import React, { useState, useEffect } from "react";
import axios from "axios"; // Importing axios for API requests

// PokemonCategory component that takes selectedCategories and onCategoryClick as props
const PokemonCategory = ({ selectedCategories, onCategoryClick }) => {
  // State to store available Pokémon types
  const [types, setTypes] = useState([]);

  // useEffect hook to fetch Pokémon types when the component mounts
  useEffect(() => {
    // Function to fetch Pokémon types from the API
    async function fetchTypes() {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        const data = response.data.results; // Extracting the results from the API response
        setTypes(data); // Setting the fetched types in the state
      } catch (error) {
        console.error("Error fetching Pokémon types:", error.message); // Handle any errors during fetching
      }
    }

    // Call the function to fetch Pokémon types
    fetchTypes();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  // Helper function to check if a category is selected
  const isCategorySelected = (category) => selectedCategories.includes(category);

  return (
    <div className="py-4 ml-11">
      {/* Header for Categories section */}
      <div className="text-red-500 text-lg font-bold mb-6">Filter pokemons by <span className="text-black">type</span></div>

      {/* Container for category buttons */}
      <div className="grid grid-cols-2 gap-4 ">
        {/* "All" Button */}
        <div className="">
          <button
            onClick={() => onCategoryClick("all")} // Clicking "All" will reset category selection
            className={`${
              selectedCategories.length === 0 ? "bg-red-500 text-white" : "bg-red-100 text-red-500"
            } px-4 py-2 rounded-full hover:bg-red-300 transition w-full`}
          >
            All
          </button>
        </div>

        {/* Buttons for each Pokémon type */}
        {types.map((type) => (
          <div key={type.name} className="">
            <button
              onClick={() => onCategoryClick(type.name)} // Clicking a type will filter Pokémon by this category
              className={`${
                isCategorySelected(type.name)
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-500"
              } px-4 py-2 rounded-full hover:bg-red-300 transition w-full`}
            >
              {type.name} {/* Display the type name */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonCategory;
