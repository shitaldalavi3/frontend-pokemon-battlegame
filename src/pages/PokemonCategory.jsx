import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PokemonCategory = () => {
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

  return (
    <div className="bg-white py-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-red-500 text-2xl font-bold p-4 px-0">
          <Link to="/">Categories</Link>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-10 gap-4">
        {types.map((type) => (
          <div key={type.name} className="bg-red-100 p-4 rounded shadow">
            {/* <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/${type.name}.png`}
            alt={`${type.name} type`}
          />*/}
            <Link
              to={`${type.name}`}
              className="text-red-500  hover:bg-red-200 transition"
            >
              {type.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonCategory;
