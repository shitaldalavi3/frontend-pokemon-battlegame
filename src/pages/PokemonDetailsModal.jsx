import React, { useRef, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import pokeball from '../assets/image/pokeball.png';


//import background image in card 
import normalImage from '../assets/image/normal type.webp';
import fireImage from '../assets/image/Fire Type.webp';
import flyingImage from '../assets/image/Flying Type.webp';
import poisonImage from '../assets/image/Poison Type.webp';
import groundImage from '../assets/image/Ground Type.webp';
import rockImage from '../assets/image/Rock Type.webp';
import bugImage from '../assets/image/Bug Type.webp';
import ghostImage from '../assets/image/Ghost Type.webp';
import steelImage from '../assets/image/Steel Type.webp';
import fightingImage from '../assets/image/Fighting Type.webp';
import waterImage from '../assets/image/Water Type.webp';
import grassImage from '../assets/image/grass type.webp';
import electricImage from '../assets/image/Electric Type.webp';
import psychicImage from '../assets/image/Psychic Type.webp';
import iceImage from '../assets/image/Ice Type.webp';
import dragonImage from '../assets/image/Dragon Type.webp';
import darkImage from '../assets/image/Dark Type.webp';
import  fairyImage from '../assets/image/Fairy Type.webp';


// import icone to card 
import normal from '../assets/icons/normal.png';
import fighting from '../assets/icons/fighting.png';
import flying from '../assets/icons/flying.png';
import poison from '../assets/icons/poison.png';
import ground from '../assets/icons/ground.png';
import rock from '../assets/icons/rock.png';
import bug from '../assets/icons/bug.png';
import ghost from '../assets/icons/ghost.png';
import steel from '../assets/icons/steel.png';
import fire from '../assets/icons/fire.png';
import water from '../assets/icons/water.jpg';
import grass from '../assets/icons/grass.png';
import electric from '../assets/icons/electric.png';
import psychic from '../assets/icons/Psychic.png';
import ice from '../assets/icons/ice.png';
import dragon from '../assets/icons/dragon.png';
import dark from '../assets/icons/dark.png';
import fairy from '../assets/icons/fairy.png';


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
  normal: normalImage,
  fighting: fightingImage,
  flying: flyingImage,
  poison: poisonImage,
  ground: groundImage,
  rock: rockImage,
  bug: bugImage,
  ghost: ghostImage,
  steel: steelImage,
  fire: fireImage,
  water: waterImage,
  grass: grassImage,
  electric: electricImage,
  psychic: psychicImage,
  ice: iceImage,
  dragon: dragonImage,
  dark: darkImage,
  fairy: fairyImage,
};

// **Define typeColorMap to map each type to a color**
const typeColorMap = {
  normal: "#949478",
  fighting: "#2F1409",
  flying: "#A98FF3",
  poison: "#2C403F",
  ground: "#A16A43",
  rock: "#5A524A",
  bug: "#183A38",
  ghost: "#240826",
  steel: "#719AA7",
  fire: "#2B0111",
  water: "#1D2635",
  grass: "#0D553F",
  electric: "#202D37",
  psychic: "#391538",
  ice: "#3F7398",
  dragon: "#120714",
  dark: "#1C040C",
  fairy: "#D096A1",
};

// Type icon map for each Pokémon type
const typeIconMap = {
  normal: normal,
  fighting: fighting,
  flying: flying,
  poison: poison,
  ground: ground,
  rock: rock,
  bug: bug,
  ghost: ghost,
  steel: steel,
  fire: fire,
  water: water,
  grass: grass,
  electric: electric,
  psychic: psychic,
  ice: ice,
  dragon: dragon,
  dark: dark,
  fairy: fairy,
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
        width: '45px', 
        height: '45px', 
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
          top: '20px', 
          left: '20px', 
          width: '23px', 
          height: '23px', 
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
