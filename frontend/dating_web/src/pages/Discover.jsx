import React, { useRef, useState } from "react";
import TinderCard from "react-tinder-card";

import "./Discover.css";

const Discover = () => {

  const [people, setPeople] = useState([
    {
      id: 1,
      name: "Olivia",
      age: 26,
      location: "San Francisco, CA",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    },

    {
      id: 2,
      name: "Emma",
      age: 24,
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
    },

    {
      id: 3,
      name: "Sophia",
      age: 27,
      location: "Los Angeles, CA",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    },

    {
      id: 4,
      name: "Ava",
      age: 25,
      location: "Chicago, IL",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
    },
  ]);


  // References for each TinderCard
  const cardRefs = useRef([]);


  // Which card is currently on top
  const [currentIndex, setCurrentIndex] = useState(
    people.length - 1
  );


  // =========================================
  // WHEN CARD IS SWIPED
  // =========================================

  const handleSwipe = (direction, person) => {

    console.log(
      person.name,
      "swiped",
      direction
    );


    if (direction === "right") {
      console.log("❤️ Like:", person.name);
    }

    if (direction === "left") {
      console.log("❌ Pass:", person.name);
    }

    setCurrentIndex((prev) => prev - 1);
  };


  // =========================================
  // BUTTON ACTION
  // =========================================

  const swipeCard = async (direction) => {

    if (currentIndex < 0) {
      return;
    }


    const card = cardRefs.current[currentIndex];


    if (card) {
      await card.swipe(direction);
    }
  };


  // =========================================
  // PROFILE BUTTON
  // =========================================

  const handleProfile = () => {

    if (currentIndex < 0) {
      return;
    }

    const person = people[currentIndex];

    console.log(
      "Open profile:",
      person.name
    );
  };


  return (

    <div className="discover_page">

      {/* =================================
          HEADING
      ================================= */}

      <h1 className="discover_title">
        Discover
      </h1>


      {/* =================================
          CARD AREA
      ================================= */}

      <div className="card_container">

        {people.map((person, index) => (

          <TinderCard
            key={person.id}

            ref={(el) => {
              cardRefs.current[index] = el;
            }}

            onSwipe={(direction) =>
              handleSwipe(
                direction,
                person
              )
            }

            preventSwipe={["up", "down"]}

            className="tinder_card"
          >

            <div
              className="profile_card"
              style={{
                backgroundImage:
                  `url(${person.image})`,
              }}
            >

              {/* Profile information */}
              <div className="profile_info">

                <div className="profile_name">

                  <h2>
                    {person.name}, {person.age}
                  </h2>

                  <span className="verified">
                    ✧
                  </span>

                </div>

                <p>
                  {person.location}
                </p>

              </div>

            </div>

          </TinderCard>

        ))}


        {/* No more profiles */}

        {currentIndex < 0 && (

          <div className="no_more_profiles">

            <h2>
              No more profiles
            </h2>

            <p>
              Come back later for more people.
            </p>

          </div>

        )}

      </div>


      {/* =================================
          ACTION BUTTONS
      ================================= */}

      <div className="action_buttons">


        {/* Block */}

        <button
          className="action_button block_button"
          onClick={() =>
            swipeCard("left")
          }
        >
          ⊘
        </button>


        {/* Pass */}

        <button
          className="action_button pass_button"
          onClick={() =>
            swipeCard("left")
          }
        >
          ×
        </button>


        {/* Like */}

        <button
          className="action_button like_button"
          onClick={() =>
            swipeCard("right")
          }
        >
          ♥
        </button>


        {/* Super Like */}

        <button
          className="action_button super_button"
          onClick={() => {
            console.log("⭐ Super Like");
            swipeCard("right");
          }}
        >
          ☆
        </button>


        {/* Profile */}

        <button
          className="action_button profile_button"
          onClick={handleProfile}
        >
          ♙
        </button>

      </div>


      {/* =================================
          LABELS
      ================================= */}

      <div className="action_labels">

        <span>
          <b>×</b> Pass
        </span>

        <span>
          <b>♥</b> Like
        </span>

        <span>
          <b>☆</b> Super Like
        </span>

        <span>
          <b>⊘</b> Block
        </span>

      </div>


      <p className="swipe_text">
        Swipe with buttons or drag the card
      </p>

    </div>
  );
};

export default Discover;