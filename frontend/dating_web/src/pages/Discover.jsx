import React, { useEffect, useRef, useState } from "react";
import TinderCard from "react-tinder-card";

import { discover, swipeUser } from "../api/allapi";
import "./Discover.css";

const SERVER_URL = "http://localhost:5000";

const Discover = () => {

  // =========================================
  // STATE
  // =========================================

  const [people, setPeople] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(true);


  // =========================================
  // CARD REFERENCES
  // =========================================

  const cardRefs = useRef([]);


  // =========================================
  // GET DISCOVER USERS
  // =========================================

  const getDiscoverUsers = async () => {

    try {

      setLoading(true);

      const response = await discover();

      console.log("Discover response:", response.data);

      const users = response.data.users || [];

      console.log(
        "First user photo:",
        users?.[0]?.photos
      );

      setPeople(users);

      setCurrentIndex(users.length - 1);

    } catch (error) {

      console.error(
        "Discover error:",
        error.response?.data || error.message
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // CALL DISCOVER API
  // =========================================

  useEffect(() => {

    getDiscoverUsers();

  }, []);


  // =========================================
  // SEND SWIPE TO BACKEND
  // =========================================

  const sendSwipe = async (person, action) => {

    try {

      const data = {
        toUser: person._id,
        action: action,
      };

      console.log("Swipe data:", data);

      const response = await swipeUser(data);

      console.log(
        "Swipe response:",
        response.data
      );

      // IMPORTANT
      // Return response so other functions
      // can use response.data
      return response;

    } catch (error) {

      console.error(
        "Swipe error:",
        error.response?.data || error.message
      );

      // Send error back to the calling function
      throw error;

    }
  };


  // =========================================
  // WHEN CARD IS SWIPED
  // =========================================

  const handleSwipe = async (direction, person) => {

    let action;

    if (direction === "right") {

      action = "like";

    } else if (direction === "left") {

      action = "pass";

    }

    if (!action) {
      return;
    }

    console.log(
      person.name,
      "swiped",
      action
    );

    try {

      await sendSwipe(
        person,
        action
      );

      // Move to next card
      setCurrentIndex(
        (prev) => prev - 1
      );

    } catch (error) {

      console.error(
        "Swipe failed:",
        error
      );

    }
  };


  // =========================================
  // BUTTON SWIPE
  // =========================================

  const swipeCard = async (direction) => {

    if (currentIndex < 0) {
      return;
    }

    const card =
      cardRefs.current[currentIndex];

    if (card) {

      await card.swipe(direction);

    }
  };


  // =========================================
  // SUPER LIKE
  // =========================================

  const superLikePerson = async () => {

    if (currentIndex < 0) {
      return;
    }

    const person =
      people[currentIndex];

    try {

      await sendSwipe(
        person,
        "superlike"
      );

      setCurrentIndex(
        (prev) => prev - 1
      );

    } catch (error) {

      console.error(
        "Super Like failed:",
        error
      );

    }
  };


  // =========================================
  // BLOCK
  // =========================================

  const blockPerson = async () => {

    if (currentIndex < 0) {
      return;
    }

    const person =
      people[currentIndex];

    try {

      // Send block to backend
      const response =
        await sendSwipe(
          person,
          "block"
        );

      console.log(
        "Block response:",
        response.data
      );


      // =====================================
      // REMOVE BLOCKED USER FROM FRONTEND
      // =====================================

      const updatedPeople =
        people.filter(
          (user) =>
            user._id !== person._id
        );


      setPeople(updatedPeople);


      // =====================================
      // UPDATE CURRENT INDEX
      // =====================================

      setCurrentIndex(
        updatedPeople.length - 1
      );

    } catch (error) {

      console.error(
        "Block failed:",
        error.response?.data ||
        error.message
      );

    }
  };


  // =========================================
  // PROFILE
  // =========================================

  const handleProfile = () => {

    if (currentIndex < 0) {
      return;
    }

    const person =
      people[currentIndex];

    console.log(
      "Open profile:",
      person
    );

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="discover_page">

        <h1 className="discover_title">
          Discover
        </h1>

        <p>
          Loading profiles...
        </p>

      </div>

    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <div className="discover_page">

      <h1 className="discover_title">
        Discover
      </h1>


      {/* =================================
          CARD AREA
      ================================= */}

      <div className="card_container">

        {people.map((person, index) => (

          <TinderCard

            key={person._id}

            ref={(el) => {

              cardRefs.current[index] = el;

            }}

            onSwipe={(direction) =>
              handleSwipe(
                direction,
                person
              )
            }

            preventSwipe={[
              "up",
              "down"
            ]}

            className="tinder_card"
          >

            <div
              className="profile_card"
              style={{
                backgroundImage:
                  `url(${SERVER_URL}${person.photos?.[0]})`,
              }}
            >

              <div className="profile_info">

                <div className="profile_name">

                  <h2>
                    {person.name}
                  </h2>

                  <span className="verified">
                    ✧
                  </span>

                </div>


                <p>

                  {person.location?.city}

                  {person.location?.state
                    ? `, ${person.location.state}`
                    : ""
                  }

                </p>


                {person.bio && (

                  <p>
                    {person.bio}
                  </p>

                )}

              </div>

            </div>

          </TinderCard>

        ))}


        {/* =================================
            NO MORE PROFILES
        ================================= */}

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


        {/* BLOCK */}

        <button
          className="action_button block_button"
          onClick={blockPerson}
        >
          ⊘
        </button>


        {/* PASS */}

        <button
          className="action_button pass_button"
          onClick={() =>
            swipeCard("left")
          }
        >
          ×
        </button>


        {/* LIKE */}

        <button
          className="action_button like_button"
          onClick={() =>
            swipeCard("right")
          }
        >
          ♥
        </button>


        {/* SUPER LIKE */}

        <button
          className="action_button super_button"
          onClick={superLikePerson}
        >
          ☆
        </button>


        {/* PROFILE */}

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