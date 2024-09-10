import { react, useState, useEffect } from "react";

const HomePage = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100"
      );
      const data = await response.json();
      setPokemonList(data.results);
    };
    fetchPokemon();
  }, []);

  return (
    <>
      <div></div>
    </>
  );
};
