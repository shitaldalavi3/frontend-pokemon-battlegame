import React, { useRef, useEffect, useState } from "react";
import fightingImage from '../assets/image/Fighting Type.webp';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import pokeball from '../assets/image/pokeball.png';
import fighting from '../assets/image/fighting_logo_transparent.png';
import fireImage from '../assets/image/Fire Type.webp';

// Helper function to convert hex color to rgba with opacity
const hexToRgba = (hex, opacity) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Custom mapping for stat names
const statNameMap = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'Sp-Atk',
  'special-defense': 'Sp-Def',
  speed: 'Speed',
};

// Mapping for background images based on type
const bgImageMap = {
  normal: '/images/normal-bg.png',
  fighting: fightingImage,
  flying: '/images/flying-bg.png',
  poison: '/images/poison-bg.png',
  ground: '/images/ground-bg.png',
  rock: '/images/rock-bg.png',
  bug: '/images/bug-bg.png',
  ghost: '/images/ghost-bg.png',
  steel: '/images/steel-bg.png',
  fire: fireImage,
  water: '/images/water-bg.png',
  grass: '/images/grass-bg.png',
  electric: '/images/electric-bg.png',
  psychic: '/images/psychic-bg.png',
  ice: '/images/ice-bg.png',
  dragon: '/images/dragon-bg.png',
  dark: '/images/dark-bg.png',
  fairy: '/images/fairy-bg.png',
};

// **Define typeColorMap to map each type to a color**
const typeColorMap = {
  normal: "#A8A77A",
  fighting: "#2F1409",
  flying: "#A98FF3",
  poison: "#A33EA1",
  ground: "#E2BF65",
  rock: "#B6A136",
  bug: "#A6B91A",
  ghost: "#735797",
  steel: "#B7B7CE",
  fire: "#2B0111",
  water: "#6390F0",
  grass: "#7AC74C",
  electric: "#F7D02C",
  psychic: "#F95587",
  ice: "#96D9D6",
  dragon: "#6F35FC",
  dark: "#705746",
  fairy: "#D685AD",
};

// Type icon map for each Pokémon type
const typeIconMap = {
  normal: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/normal.svg",
  fighting: fighting,
  flying: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/flying.svg",
  poison: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/poison.svg",
  ground: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ground.svg",
  rock: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/rock.svg",
  bug: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/bug.svg",
  ghost: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ghost.svg",
  steel: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/steel.svg",
  fire: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg",
  water: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/water.svg",
  grass: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/grass.svg",
  electric: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/electric.svg",
  psychic: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/psychic.svg",
  ice: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ice.svg",
  dragon: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dragon.svg",
  dark: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dark.svg",
  fairy: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fairy.svg",
};

const PokemonDetailsModal = ({ pokemon, onClose }) => {
  const [activeTab, setActiveTab] = useState('about'); // 'about' or 'stats'
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const firstType = pokemon.types[0].type.name;
  const backgroundImage = bgImageMap[firstType];
  const typeColor = typeColorMap[firstType]; // Get the background color based on the first type
  const typeIconUrl = typeIconMap[firstType]; // Get the type icon URL based on the first type

  // Convert the typeColor to rgba with opacity
  const typeColorWithOpacity = hexToRgba(typeColor, 0.8); // 0.8 is the opacity value

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          width: '450px',
          height: '650px',
          backgroundImage: `url(${backgroundImage})`, // Set background image based on type
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: "10px",
          border: "10px solid white",
        }}
      >
        {/* Top part tringal */}
          <div
            style={{
              backgroundColor: 'white', // White background for name
              padding: '20px',
              clipPath: 'polygon(0 0, 10% 0, 30% 00%, 10% 0%, 0 100%)', // Slanted end shape
            }}
          >
       {/* Pokeball Image */}
      <img
        src= {pokeball} // Replace with the correct path to your Pokeball PNG
        alt="Pokeball"
        style={{
          position: 'absolute',
          top: '0px', 
          left: '1px', 
          width: '22px', 
          height: '22px', 
        }}
          />
      </div> 

          

        {/* Mirrored Right Side Triangle at the bottom corner */}
    <div
      style={{
        position: 'absolute',
        bottom: -1,
        right: 0,
        width: '40px', 
        height: '40px', 
        backgroundColor: 'white',
        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', 
      }}
      >
        {/* type logo */}
      <img
        src= {typeIconUrl}
        alt={firstType}
        style={{
          position: 'absolute',
          top: '15px', 
          left: '15px', 
          width: '25px', 
          height: '25px', 
        }}
          />
    </div>  

        {/* Top part with Name and Type */}
        <div className="relative mt-5 ">
          <div
            className="relative flex items-center"
            style={{
              backgroundColor: 'white', // White background for name
              padding: '2px',
              clipPath: 'polygon(0 0, 35% 0, 43% 00%, 35% 100%, 0 100%)', // Slanted end shape
            }}
          >
            <h2 className="text-xl font-bold text-black capitalize ml-2">
              {pokemon.name}
            </h2>
       {/* Display Type Icon After Pokémon Name */}
            <img
              src={typeIconUrl} // Type logo based on the first type
              alt={firstType}
              className="w-6 h-6 ml-2" // Adjust size and spacing
            />
          </div>
        </div>

        {/* Pokémon Image Centered */}
            <div className="flex items-center justify-center" style={{ height: '70%' }}>
          <img
            src={pokemon.sprites.other.dream_world.front_default}
            alt={pokemon.name}
            className="object-contain"
            style={{ width: '500px', height: '350px' }} // Centered Pokémon image with a fixed size
          />
        </div>

        {/* Content container with tabs */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-11/12"
          style={{
            backgroundColor: typeColorWithOpacity, // Type color with opacity
            borderRadius: '15px',
            padding: '10px',
          }}
        >
          {/* Tabs - About and Stats */}
          <div className="flex justify-around mb-2">
            <span
              onClick={() => setActiveTab('about')}
              className={`cursor-pointer text-white text-sm ${activeTab === 'about' ? 'underline font-bold' : ''}`}
            >
              About
            </span>
            <span
              onClick={() => setActiveTab('stats')}
              className={`cursor-pointer text-white text-sm ${activeTab === 'stats' ? 'underline font-bold' : ''}`}
            >
              Base Stats
            </span>
          </div>

          {/* About Content */}
          {activeTab === 'about' && (
            <div className="text-white text-sm">
              <p><strong>Height :</strong> {pokemon.height / 10}m</p>
              <p><strong>Weight :</strong> {pokemon.weight / 10}kg</p>
              <p><strong>Abilities :</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            </div>
          )}

          {/* Stats Content */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-3 gap-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex justify-between items-center">
                  {/* Stat name */}
                  <div className="text-sm text-white capitalize">
                    {statNameMap[stat.stat.name] || stat.stat.name}
                  </div>
                  {/* Circular progress bar */}
                  <div style={{ width: 20, height: 20 }}>
                    <CircularProgressbar
                      value={stat.base_stat}
                      strokeWidth={20} // Thicker stroke width
                      maxValue={200} // Assuming max value as 200 for all stats
                      styles={buildStyles({
                        pathColor: '#fff',
                        trailColor: 'rgba(255, 255, 255, 0.2)',
                        strokeLinecap: 'round',
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailsModal;
