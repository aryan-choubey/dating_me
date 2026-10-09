import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [error, setError] = useState("");

  const [profileModal, setProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const [swipeLabels, setSwipeLabels] = useState({});
  const [swiping, setSwiping] = useState(false);

  // =========================================
  // REFS
  // =========================================

  const cardRefs = useRef([]);
  const processingRef = useRef(false);
  const swipedCardsRef = useRef(new Set());

  // =========================================
  // FETCH DISCOVER USERS
  // =========================================

  const fetchPeople = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await discover();

      const users =
        response?.data?.users ||
        response?.data?.people ||
        response?.users ||
        response?.people ||
        [];

      const validUsers = Array.isArray(users) ? users : [];

      setPeople(validUsers);
      setCurrentIndex(validUsers.length - 1);

      cardRefs.current = [];
      swipedCardsRef.current = new Set();
      processingRef.current = false;
      setSwiping(false);
      setSwipeLabels({});
    } catch (err) {
      console.error("Discover API error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load profiles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // =========================================
  // PHOTO URL
  // =========================================

  const getPhotoUrl = (photo) => {
    if (!photo) return "";

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://")
    ) {
      return photo;
    }

    return `${SERVER_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };

  // =========================================
  // CALCULATE AGE
  // =========================================

  const calculateAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);

    if (Number.isNaN(birthDate.getTime())) {
      return null;
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : null;
  };

  // =========================================
  // SEND SWIPE TO BACKEND
  // =========================================

  const sendSwipe = async (person, action) => {
    if (!person?._id || !action) return;

    try {
      await swipeUser({
        toUser: person._id,
        action,
      });

      return true;
    } catch (err) {
      console.error("Swipe API error:", err);

      console.error(
        "Backend response:",
        err?.response?.data || err.message
      );

      return false;
    }
  };

  // =========================================
  // HANDLE SWIPE
  // =========================================
const handleSwipe = (direction, person, index) => {
  if (!person?._id) return;
  if (index !== currentIndex) return;
  if (swipedCardsRef.current.has(person._id)) return;
  if (processingRef.current) return;

  processingRef.current = true;
  swipedCardsRef.current.add(person._id);

  const actionMap = {
    right: "like",
    left: "pass",
    up: "superlike",
    down: "block",
  };

  const action = actionMap[direction];

  setSwipeLabels((previous) => ({
    ...previous,
    [person._id]: direction,
  }));

  // Advance immediately; don't wait for the API.
  setCurrentIndex((previous) => Math.min(previous, index - 1));

  // Save the action independently.
  sendSwipe(person, action).finally(() => {
    console.log(`Finished saving ${action} action`);
  });

  window.setTimeout(() => {
    processingRef.current = false;
    setSwiping(false);

    setSwipeLabels((previous) => {
      const updated = { ...previous };
      delete updated[person._id];
      return updated;
    });
  }, 300);
};
  // =========================================
  // SWIPE BUTTONS
  // =========================================

  const swipeCard = (direction) => {
    if (currentIndex < 0) return;

    if (processingRef.current) return;

    const currentCard = cardRefs.current[currentIndex];

    if (!currentCard) {
      console.warn("Active card reference not available.");
      return;
    }

    // TinderCard supports left, right, up, and down.
    currentCard.swipe(direction);
  };

  // =========================================
  // SWIPE LABEL ANIMATION
  // =========================================

  const handleSwipeRequirementFulfilled = (
    direction,
    personId
  ) => {
    if (processingRef.current) return;

    setSwipeLabels((previous) => ({
      ...previous,
      [personId]: direction,
    }));
  };

  const handleSwipeRequirementUnfulfilled = (personId) => {
    if (processingRef.current) return;

    setSwipeLabels((previous) => {
      const updated = { ...previous };
      delete updated[personId];
      return updated;
    });
  };

  // =========================================
  // OPEN PROFILE MODAL
  // =========================================

  const openProfile = (person) => {
    if (!person) return;

    setSelectedProfile(person);
    setSelectedPhotoIndex(0);
    setProfileModal(true);
  };

  const closeProfile = () => {
    setProfileModal(false);
    setSelectedProfile(null);
    setSelectedPhotoIndex(0);
  };

  // =========================================
  // CLOSE MODAL WITH ESCAPE
  // =========================================

  useEffect(() => {
    if (!profileModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeProfile();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [profileModal]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="discover_page">
        <div className="discover_status">
          <div className="discover_loader"></div>

          <h2>Finding your connections...</h2>

          <p>Discovering people for you.</p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && people.length === 0) {
    return (
      <div className="discover_page">
        <div className="discover_status">
          <h2>Oops!</h2>

          <p>{error}</p>

          <button
            className="retry_button"
            onClick={fetchPeople}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // EMPTY PROFILES
  // =========================================

  if (people.length === 0) {
    return (
      <div className="discover_page">
        <div className="discover_status">
          <div className="empty_heart">♡</div>

          <h2>No profiles right now</h2>

          <p>Check back later to discover more people.</p>

          <button
            className="retry_button"
            onClick={fetchPeople}
          >
            Refresh Profiles
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="discover_page">
      <div className="discover_content">

        {/* HEADER */}

        <div className="discover_header">
          <div>
            <span className="discover_eyebrow">
              YOUR NEXT CONNECTION
            </span>

            <h1>
              Discover <span>People</span>
            </h1>

            <p>
              Meet someone who makes your world brighter.
            </p>
          </div>

          <div className="profiles_remaining">
            <span className="online_dot"></span>

            {Math.max(currentIndex + 1, 0)} profiles left
          </div>
        </div>

        {/* CARD AREA */}

        <div className="discover_card_area">
          <div className="card_container">

            {people.map((person, index) => {
              const age = calculateAge(person.dob);

              const photos = Array.isArray(person.photos)
                ? person.photos
                : [];

              const firstPhoto = photos.length
                ? getPhotoUrl(photos[0])
                : "";

              const isActive = index === currentIndex;

              const swipeDirection =
                swipeLabels[person._id];

              return (
                <TinderCard
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  key={person._id}
                  className={`tinder_card ${
                    isActive ? "active_tinder_card" : ""
                  }`}
                  onSwipe={(direction) =>
                    handleSwipe(direction, person, index)
                  }
                  onSwipeRequirementFulfilled={(direction) =>
                    handleSwipeRequirementFulfilled(
                      direction,
                      person._id
                    )
                  }
                  onSwipeRequirementUnfulfilled={() =>
                    handleSwipeRequirementUnfulfilled(
                      person._id
                    )
                  }
                  preventSwipe={[]}
                  swipeRequirementType="position"
                  swipeThreshold={100}
                  flickOnSwipe={true}
                  rotationPower={20}
                  swipeSpeed={2}
                >
                  <div className="profile_card">

                    {/* PROFILE IMAGE */}

                    {firstPhoto ? (
                      <img
                        src={firstPhoto}
                        alt={person.name || "Profile"}
                        className="swipe_card_image"
                        draggable="false"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="profile_image_placeholder">
                        <span>♡</span>
                        <p>No photo available</p>
                      </div>
                    )}

                    {/* GRADIENT */}

                    <div className="profile_card_gradient"></div>

                    {/* SWIPE BADGE */}

                    {isActive && swipeDirection && (
                      <div
                        className={`swipe_badge swipe_badge_${swipeDirection}`}
                      >
                        {swipeDirection === "right" && "LIKE"}
                        {swipeDirection === "left" && "PASS"}
                        {swipeDirection === "up" && "SUPER LIKE"}
                        {swipeDirection === "down" && "BLOCK"}
                      </div>
                    )}

                    {/* TOP BADGE */}

                    <div className="profile_top_badge">
                      <span className="profile_online_dot"></span>
                      SoulSpark Profile
                    </div>

                    {/* PROFILE INFORMATION */}

                    <div className="profile_card_info">
                      <div className="profile_name_row">
                        <div>
                          <h2>
                            {person.name || "Unknown"}

                            {age !== null && (
                              <span className="profile_age">
                                , {age}
                              </span>
                            )}
                          </h2>

                          <p className="profile_location">
                            <span>⌖</span>

                            {[
                              person.location?.city,
                              person.location?.state,
                              person.location?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") ||
                              "Location not specified"}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="profile_details_button"
                          onClick={() => openProfile(person)}
                          aria-label="View full profile"
                          title="View full profile"
                        >
                          ⓘ
                        </button>
                      </div>

                      {/* {person.bio && (
                        <p className="profile_bio">
                          {person.bio.length > 110
                            ? `${person.bio.slice(0, 110)}...`
                            : person.bio}
                        </p>
                      )} */}

                      {Array.isArray(person.interests) &&
                        person.interests.length > 0 && (
                          <div className="profile_interests">
                            {person.interests
                              .slice(0, 3)
                              .map((interest, interestIndex) => (
                                <span
                                  key={`${interest}-${interestIndex}`}
                                >
                                  {interest}
                                </span>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>
                </TinderCard>
              );
            })}

            {/* NO MORE CARDS */}

            {currentIndex < 0 && (
              <div className="no_more_cards">
                <div className="empty_heart">♡</div>

                <h2>You're all caught up!</h2>

                <p>You've seen all available profiles.</p>

                <button
                  className="retry_button"
                  onClick={fetchPeople}
                >
                  Refresh Profiles
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}

        {currentIndex >= 0 && (
          <div className="swipe_actions">
            <button
              type="button"
              className="action_button action_pass"
              onClick={() => swipeCard("left")}
              disabled={swiping}
              title="Pass"
              aria-label="Pass"
            >
              <span>✕</span>
              <small>PASS</small>
            </button>

            <button
              type="button"
              className="action_button action_block"
              onClick={() => swipeCard("down")}
              disabled={swiping}
              title="Block"
              aria-label="Block"
            >
              <span>⊘</span>
              <small>BLOCK</small>
            </button>

            <button
              type="button"
              className="action_button action_superlike"
              onClick={() => swipeCard("up")}
              disabled={swiping}
              title="Super Like"
              aria-label="Super Like"
            >
              <span>★</span>
              <small>SUPER</small>
            </button>

            <button
              type="button"
              className="action_button action_like"
              onClick={() => swipeCard("right")}
              disabled={swiping}
              title="Like"
              aria-label="Like"
            >
              <span>♥</span>
              <small>LIKE</small>
            </button>

            <button
              type="button"
              className="action_button action_profile"
              onClick={() => openProfile(people[currentIndex])}
              disabled={swiping}
              title="View Profile"
              aria-label="View Profile"
            >
              <span>ⓘ</span>
              <small>PROFILE</small>
            </button>
          </div>
        )}

        <p className="discover_hint">
          Drag a card to respond, or use the buttons below.
        </p>
      </div>

      {/* =========================================
          FULL PROFILE MODAL
      ========================================= */}

      {profileModal && selectedProfile && (
        <div
          className="profile_modal_overlay"
          onClick={closeProfile}
        >
          <div
            className="profile_modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="profile_modal_close"
              onClick={closeProfile}
              aria-label="Close profile"
            >
              ×
            </button>

            {/* MODAL PHOTOS */}

            <div className="modal_photo_section">
              {selectedProfile.photos?.length > 0 ? (
                <>
                  <img
                    className="modal_profile_image"
                    src={getPhotoUrl(
                      selectedProfile.photos[selectedPhotoIndex]
                    )}
                    alt={selectedProfile.name || "Profile"}
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  {selectedProfile.photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="modal_photo_arrow modal_photo_previous"
                        onClick={() =>
                          setSelectedPhotoIndex((previous) =>
                            previous === 0
                              ? selectedProfile.photos.length - 1
                              : previous - 1
                          )
                        }
                        aria-label="Previous photo"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        className="modal_photo_arrow modal_photo_next"
                        onClick={() =>
                          setSelectedPhotoIndex(
                            (previous) =>
                              (previous + 1) %
                              selectedProfile.photos.length
                          )
                        }
                        aria-label="Next photo"
                      >
                        ›
                      </button>

                      <div className="modal_photo_dots">
                        {selectedProfile.photos.map(
                          (photo, index) => (
                            <button
                              key={`${photo}-${index}`}
                              type="button"
                              className={
                                index === selectedPhotoIndex
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                setSelectedPhotoIndex(index)
                              }
                              aria-label={`View photo ${index + 1}`}
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="modal_no_photo">♡</div>
              )}
            </div>

            {/* MODAL DETAILS */}

            <div className="modal_profile_details">
              <span className="discover_eyebrow">
                SOULSPARK MEMBER
              </span>

              <h2>
                {selectedProfile.name || "Unknown"}

                {calculateAge(selectedProfile.dob) !== null &&
                  `, ${calculateAge(selectedProfile.dob)}`}
              </h2>

              <p className="modal_location">
                ⌖{" "}
                {[
                  selectedProfile.location?.city,
                  selectedProfile.location?.state,
                  selectedProfile.location?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "Location not specified"}
              </p>

              <div className="modal_detail_divider"></div>

              <h3>About me</h3>

              <p className="modal_bio">
                {selectedProfile.bio || "No bio added yet."}
              </p>

              <h3>Interests</h3>

              {selectedProfile.interests?.length > 0 ? (
                <div className="modal_interests">
                  {selectedProfile.interests.map(
                    (interest, index) => (
                      <span key={`${interest}-${index}`}>
                        {interest}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="modal_empty_text">
                  No interests added yet.
                </p>
              )}

              <button
                type="button"
                className="modal_done_button"
                onClick={closeProfile}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;