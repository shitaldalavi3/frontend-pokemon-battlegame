import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonCategories = () => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/type');
        const data = response.data.results;
        setTypes(data);
      } catch (error) {
        console.error('Error fetching Pokémon types:', error.message);
      }
    }

    fetchTypes();
  }, []);

  return (
    <div className="pokemon-categories">
      {types.map((type) => (
        <div key={type.name} className="pokemon-type-card">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/${type.name}.png`}
            alt={`${type.name} type`}
          />
          <p>{type.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PokemonCategories;
