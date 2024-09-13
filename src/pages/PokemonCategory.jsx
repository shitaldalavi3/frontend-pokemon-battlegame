import React, { useState, useEffect } from "react";
import axios from "axios";  // Importing axios for API requests

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
        const data = response.data.results;  // Extracting the results from the API response
        setTypes(data);  // Setting the fetched types in the state
      } catch (error) {
        console.error("Error fetching Pokémon types:", error.message);  // Handle any errors during fetching
      }
    }

    // Call the function to fetch Pokémon types
    fetchTypes();
  }, []);  // Empty dependency array ensures it runs only once when the component mounts

  // Helper function to check if a category is selected
  const isCategorySelected = (category) => selectedCategories.includes(category);

  return (
    <div className="bg-white py-4">
      {/* Header for Categories section */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-red-500 text-2xl font-bold p-4 px-0">Categories</div>
      </div>

      {/* Container for category buttons */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-10 gap-4">
        {/* "All" Button */}
        <div className="bg-red-100 p-4 rounded shadow">
          <button
            onClick={() => onCategoryClick("all")}  // Clicking "All" will reset category selection
            className={`${
              selectedCategories.length === 0 ? "bg-red-300" : "text-red-500"
            } hover:bg-red-200 transition`}
          >
            All
          </button>
        </div>

        {/* Buttons for each Pokémon type */}
        {types.map((type) => (
          <div key={type.name} className="bg-red-100 p-4 rounded shadow">
            <button
              onClick={() => onCategoryClick(type.name)}  // Clicking a type will filter Pokémon by this category
              className={`${
                isCategorySelected(type.name) ? "bg-red-300" : "text-red-500"
              } hover:bg-red-200 transition`}
            >
              {type.name}  {/* Display the type name */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonCategory;
