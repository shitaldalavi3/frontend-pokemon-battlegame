// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupbg from "../assets/image/signup bg.jpeg";
import pokeball from '../assets/image/pokeball.png';

function Signup() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  // Function to handle form submission
  const handleNameSubmit = (e) => {
    e.preventDefault();

    if (username.trim() !== "") {
      // Store username in localStorage
      localStorage.setItem("username", JSON.stringify(username));
      setShowPopup(false); // Hide the popup after submitting the name
      navigate("/home"); // Navigate to the homepage after signup
    } else {
      alert("Please enter your name."); // Basic validation
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full background image */}
      <div
        className={`fixed inset-0 bg-cover bg-center ${
          !showPopup ? "hidden" : "block"
        } transition-opacity duration-300`}
        style={{ backgroundImage: `url(${signupbg})` }} 
      ></div>

      {/* Popup for entering the username */}
      {showPopup && (
        <div className="flex items-center justify-center fixed inset-0 mt-16 ">
          <form
            onSubmit={handleNameSubmit}
            className=" p-10 relative rounded shadow-lg text-center"
            style={{ transform: "translateX(-55px)" }}
          >
            <h2 className="text-3xl text-white text-center font-semibold mb-4">
            Welcome to Pokémon <br />
            Begin Your Epic Adventure!
            </h2> 
            <div className="m-4 mt-10">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your Name"
                className="w-full text-black px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:border-red-800"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 mt-7 py-2 bg-red-800 text-white font-semibold rounded hover:bg-orange-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Signup;
