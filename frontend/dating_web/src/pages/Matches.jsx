import React, { useEffect, useState } from "react";
import { getMatch } from "../api/allapi";
import {useNavigate} from "react-router-dom";
import "./Matches.css";

const SERVER_URL = "http://localhost:5000";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

 const navigate = useNavigate();


  // ==================================
  // FETCH MATCHES
  // ==================================

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const response = await getMatch();

      setMatches(response.data.matches || []);

    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);


  // ==================================
  // GET PROFILE IMAGE
  // ==================================

  const getImage = (user) => {
    if (user?.photos?.[0]) {
      return `${SERVER_URL}${user.photos[0]}`;
    }

    return "/default-profile.png";
  };



  const handleMessage = (user) => {
    console.log("Open message with:", user._id);

    // Later:
    navigate(`/messages/${user._id}`);
  };



  if (loading) {
    return (
      <div className="match-page">
        <div className="match-loading">
          Loading matches...
        </div>
      </div>
    );
  }


  return (
    <div className="match-page">

      {/* HEADER */}

      <div className="match-header">
        <h1>Your Matches</h1>

        <p>
          People you matched with
        </p>
      </div>



      {matches.length === 0 ? (

        <div className="empty-matches">

          <div className="empty-match-icon">
            ♡
          </div>

          <h3>
            No matches yet
          </h3>

          <p>
            When you and someone like each other,
            your match will appear here.
          </p>

        </div>

      ) : (


        
        <div className="matches-container">

          {matches.map((match) => {

            const user = match.user;

            return (
              <div
                className="match-card"
                key={match.matchId}
              >



                <img
                  src={getImage(user)}
                  alt={user?.name || "Profile"}
                  className="match-profile-image"
                />




                <div className="match-user-info">

                  <h3>
                    {user?.name || "Unknown"}
                  </h3>

                </div>




                <button
                  className="message-button"
                  onClick={() => handleMessage(user)}
                >
                  <span className="message-icon">
                    💬
                  </span>

                  Message
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Matches;