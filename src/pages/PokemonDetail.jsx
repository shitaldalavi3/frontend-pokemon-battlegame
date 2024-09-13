import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams to access URL parameters

// PokemonDetails component
const PokemonDetails = () => {
  const { name } = useParams();  // Get the Pokémon name from the URL parameter
  const [pokemonDetails, setPokemonDetails] = useState(null);  // State to store Pokémon details
  const [isAdded, setIsAdded] = useState(false);  // State to track if the Pokémon has been added to the roster

  // useEffect to fetch Pokémon details when the component mounts or when the name changes
  useEffect(() => {
    // Function to fetch the Pokémon details from the API
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);  // Fetch Pokémon data by name
        const data = await response.json();  // Parse the JSON response
        setPokemonDetails(data);  // Update the state with the fetched Pokémon details
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);  // Handle any errors during fetching
      }
    };

    // Call the fetch function
    fetchPokemonDetails();
  }, [name]);  // Dependency array with `name` ensures the fetch is triggered when the name changes

  // Function to add the Pokémon to the roster
  const addPokemonToRoster = () => {
    const roster = JSON.parse(localStorage.getItem("roster")) || [];  // Get the current roster from localStorage or initialize it as an empty array
    if (!roster.includes(name)) {
      // Check if the Pokémon is already in the roster
      roster.push(name);  // Add the Pokémon to the roster
      localStorage.setItem("roster", JSON.stringify(roster));  // Save the updated roster back to localStorage
      setIsAdded(true);  // Update the state to mark the Pokémon as added
      alert(`${name} has been added to your roster!`);  // Show confirmation alert
    } else {
      alert(`${name} is already in your roster.`);  // Show alert if the Pokémon is already in the roster
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8">
        {pokemonDetails ? (  // Check if Pokémon details have been loaded
          <div className="max-w-lg mx-auto">
            {/* Display Pokémon name */}
            <h1 className="text-3xl font-bold capitalize text-center mb-6">
              {pokemonDetails.name}
            </h1>
            {/* Display Pokémon sprite */}
            <img
              src={pokemonDetails.sprites.front_default}
              alt={pokemonDetails.name}
              className="w-64 h-64 object-contain mx-auto"
            />
            <div className="mt-4">
              {/* Display Pokémon stats */}
              <h2 className="text-xl font-semibold mb-2">Stats:</h2>
              <ul className="list-disc list-inside">
                {pokemonDetails.stats.map((stat) => (
                  <li key={stat.stat.name} className="capitalize">
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>

              {/* Display Pokémon abilities */}
              <h2 className="text-xl font-semibold mt-4 mb-2">Abilities:</h2>
              <ul className="list-disc list-inside">
                {pokemonDetails.abilities.map((ability) => (
                  <li key={ability.ability.name} className="capitalize">
                    {ability.ability.name}
                  </li>
                ))}
              </ul>

              {/* Add to Roster button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={addPokemonToRoster}  // Handle the add to roster click
                  className={`${
                    isAdded ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-400"
                  } text-white px-6 py-2 rounded transition`}
                  disabled={isAdded}  // Disable the button if the Pokémon is already added
                >
                  {isAdded ? "Added to Roster" : "Add to Roster"}  {/* Change button text based on the isAdded state */}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading Pokémon details...</p>  // Show loading message while details are being fetched
        )}
      </div>
    </div>
  );
};

export default PokemonDetails;
