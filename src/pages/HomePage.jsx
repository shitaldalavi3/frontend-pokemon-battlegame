import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
        const data = await response.json();
        setPokemonList(
          data.results.map((result) => ({
            id: result.url.match(/\/([0-9]*)\/$/)[1],
            name: result.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              result.url.match(/\/([0-9]*)\/$/)[1]
            }.png`,
          }))
        );
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  const handleButtononClick = () => {
    setShowData(showData);
  };
  return (
    <>
      <Box p="6">
        <Heading mb="6" textAlign="center">
          My Pokémon Collection
        </Heading>
        <Flex justifyContent="center">
          <Button colorScheme="teal" onClick={handleButtonClick}>
            {showData ? "Hide Pokémon" : "Show Pokémon"}
          </Button>
        </Flex>
        {showData && (
          <Flex mt="6" flexWrap="wrap" justifyContent="center">
            {data.map((pokemon) => (
              <Box key={pokemon.id} color="white" backgroundColor="black">
                <img src={pokemon.image} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
      {/*
      <div className="container mx-auto p-16">
        <h2 className="text-4xl font-bold mb-6 font-serif  text-secondary">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemonList.map((pokemon) => (
            <ProductCard key={pokemon._id} product={product} />
          ))}
        </div>
      </div>*/}
    </>
  );
};
