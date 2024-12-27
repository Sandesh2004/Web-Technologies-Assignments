import React, { useState, useEffect } from "react";

const DogSearchApp = () => {
  const [breeds, setBreeds] = useState({});
  const [selectedBreed, setSelectedBreed] = useState("");
  const [dogImages, setDogImages] = useState([]);
  const [dogDetails, setDogDetails] = useState([]);

  useEffect(() => {
    // Fetch the list of dog breeds from the API
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((response) => response.json())
      .then((data) => {
        setBreeds(data.message);
      })
      .catch((error) => console.error("Error fetching breeds:", error));
  }, []);

  const generateRandomDescription = () => {
    const descriptions = [
      "A playful, loyal companion with boundless energy.",
      "An affectionate and friendly dog with a heart of gold.",
      "A brave and intelligent breed, known for its loyalty.",
      "A charming and active dog, always ready for adventure.",
      "A calm and gentle dog, perfect for family life.",
      "A spirited and strong breed with a love for playtime.",
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
    let images = [];
    let details = [];

    const fetchImage = (index) => {
      fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then((response) => response.json())
        .then((data) => {
          images.push(data.message);
          // Generate random details for each image
          details.push({
            name: `Dog ${index + 1}`,
            age: Math.floor(Math.random() * 10) + 1, // Random age between 1 and 10
            description: generateRandomDescription(), // Random description for each dog
          });

          if (images.length === 6) {
            setDogImages(images);
            setDogDetails(details);
          }
        })
        .catch((error) => console.error("Error fetching dog images:", error));
    };

    for (let i = 0; i < 6; i++) {
      fetchImage(i); // Fetch 6 individual dog images
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
        background: "linear-gradient(135deg, #1c1c1c, #333333)",
        color: "white",
        overflowX: "hidden",
        height: "100%",
        backgroundColor: "#000000", // Pitch black background
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "4rem", // Increased font size for better visibility
            color: "yellow", // Title in yellow
            fontWeight: "bold",
          }}
        >
          Dog Search
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginTop: "10px",
            color: "#f1f1f1",
          }}
        >
          Welcome to Dog Search, your ultimate destination for discovering dog
          breeds and their unique characteristics. Our goal is to help dog
          lovers explore a diverse range of breeds and learn more about their
          traits, personalities, and appearances.
        </p>
        <p
          style={{
            fontSize: "1rem",
            marginTop: "20px",
            color: "#dcdcdc",
            lineHeight: "1.5",
          }}
        >
          Simply select a breed from the dropdown menu below, and you'll be
          presented with stunning images and interesting details about that
          breed. Each dog has its own story, and through this website, we hope
          to bring those stories to life.
        </p>
      </header>

      <section style={{ textAlign: "center", marginBottom: "20px" }}>
        <select
          value={selectedBreed}
          onChange={(e) => handleBreedSelect(e.target.value)}
          style={{
            padding: "10px",
            backgroundColor: "#444",
            color: "white",
            borderRadius: "5px",
            fontSize: "1rem",
            border: "2px solid #333",
            width: "250px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">--Select a breed--</option>
          {Object.keys(breeds).map((breed) => (
            <option key={breed} value={breed}>
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </option>
          ))}
        </select>
      </section>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {dogImages.length > 0 &&
          dogImages.map((image, index) => (
            <div
              key={index}
              style={{
                width: "200px",
                textAlign: "center",
                backgroundColor: "#222",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.7)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={image}
                alt={`Dog ${index + 1}`}
                style={{
                  width: "100%",
                  height: "200px", // Fixed height to ensure all images are uniform
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(102, 204, 255, 0.8)", // Light blue glow
                }}
              />
              <div style={{ color: "#f1f1f1", marginTop: "10px" }}>
                <h4 style={{ fontSize: "1.2rem", color: "#66ccff" }}>
                  {dogDetails[index]?.name}
                </h4>
                <p style={{ fontSize: "1rem" }}>
                  Age: {dogDetails[index]?.age} years
                </p>
                <p>{dogDetails[index]?.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DogSearchApp;
