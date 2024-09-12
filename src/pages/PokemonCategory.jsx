import React, { useState, useEffect } from "react";
import axios from "axios";

const PokemonCategory = ({ selectedCategories, onCategoryClick }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        const data = response.data.results;
        setTypes(data);
      } catch (error) {
        console.error("Error fetching Pokémon types:", error.message);
      }
    }

    fetchTypes();
  }, []);

  // Check if a category is selected
  const isCategorySelected = (category) => selectedCategories.includes(category);

  return (
    <div className="bg-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-red-500 text-2xl font-bold p-4 px-0">Categories</div>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-10 gap-4">
        {/* "All" Button */}
        <div className="bg-red-100 p-4 rounded shadow">
          <button
            onClick={() => onCategoryClick("all")} // Trigger "All" action
            className={`${
              selectedCategories.length === 0 ? "bg-red-300" : "text-red-500"
            } hover:bg-red-200 transition`}
          >
            All
          </button>
        </div>
        {/* Category Buttons */}
        {types.map((type) => (
          <div key={type.name} className="bg-red-100 p-4 rounded shadow">
            <button
              onClick={() => onCategoryClick(type.name)}
              className={`${
                isCategorySelected(type.name) ? "bg-red-300" : "text-red-500"
              } hover:bg-red-200 transition`}
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
