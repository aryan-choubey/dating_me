import React, { useState } from "react";
import "./UserDetail.css";

import logo from "../assets/logo/logo.png";

const UserDetail = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    interestedIn: "",
    bio: "",
    photos: [],
    interests: [],
    location: "",
  });

  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="user-detail-page">

      {/* ================= HEADER ================= */}

      <div className="user-detail-header">

        {/* OUTSIDE BACK BUTTON */}
        <button
          className="back-btn outside-back"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        {/* CENTER LOGO */}
        <img
          src={logo}
          alt="Logo"
          className="user-detail-logo"
        />

        {/* STEP COUNT */}
        <div className="step-count">
          {step} of {totalSteps}
        </div>

      </div>


      {/* ================= PROGRESS ================= */}

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${(step / totalSteps) * 100}%`,
          }}
        />
      </div>


      {/* ================= WHITE CARD ================= */}

      <div className="user-detail-card">

        {/* INSIDE CARD BACK BUTTON */}

        {step > 1 && (
          <button
            className="card-back-btn"
            onClick={previousStep}
          >
            ← Back
          </button>
        )}


        {/* ================= STEP 1 ================= */}

        {step === 1 && (
          <div className="step-content">

            <h1>Tell us about you</h1>

            <p className="step-description">
              Let's get to know you a little better.
            </p>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>I am</label>

              <div className="option-row">

                {["Male", "Female", "Other"].map((item) => (
                  <button
                    key={item}
                    className={
                      formData.gender === item
                        ? "option-btn active"
                        : "option-btn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        gender: item,
                      })
                    }
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>


            <div className="form-group">
              <label>Interested in</label>

              <div className="option-row">

                {["Men", "Women", "Everyone"].map((item) => (
                  <button
                    key={item}
                    className={
                      formData.interestedIn === item
                        ? "option-btn active"
                        : "option-btn"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        interestedIn: item,
                      })
                    }
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>


            <button
              className="continue-btn"
              onClick={nextStep}
            >
              Continue
            </button>

          </div>
        )}


        {/* ================= STEP 2 ================= */}

        {step === 2 && (
          <div className="step-content">

            <h1>Tell us about yourself</h1>

            <p className="step-description">
              Give people a little idea about who you are.
            </p>

            <div className="form-group">

              <label>About You</label>

              <textarea
                name="bio"
                placeholder="Write something about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows="7"
              />

            </div>

            <button
              className="continue-btn"
              onClick={nextStep}
            >
              Continue
            </button>

          </div>
        )}


        {/* ================= STEP 3 ================= */}

        {step === 3 && (
          <div className="step-content">

            <h1>Add your photos</h1>

            <p className="step-description">
              Add some photos so people can get to know you.
            </p>

            <div className="photo-upload-area">

              <div className="photo-box">
                +
              </div>

              <div className="photo-box">
                +
              </div>

              <div className="photo-box">
                +
              </div>

              <div className="photo-box">
                +
              </div>

            </div>

            <p className="photo-note">
              Add at least 2 photos to continue.
            </p>

            <button
              className="continue-btn"
              onClick={nextStep}
            >
              Continue
            </button>

          </div>
        )}


        {/* ================= STEP 4 ================= */}

        {step === 4 && (
          <div className="step-content">

            <h1>Pick your interests</h1>

            <p className="step-description">
              Choose things you enjoy.
            </p>

            <div className="interest-container">

              {[
                "Travel",
                "Music",
                "Movies",
                "Gaming",
                "Sports",
                "Reading",
                "Cooking",
                "Photography",
                "Fitness",
                "Dancing",
                "Art",
                "Chess",
              ].map((interest) => (
                <button
                  key={interest}
                  className="interest-btn"
                >
                  {interest}
                </button>
              ))}

            </div>

            <button
              className="continue-btn"
              onClick={nextStep}
            >
              Continue
            </button>

          </div>
        )}


        {/* ================= STEP 5 ================= */}

        {step === 5 && (
          <div className="step-content">

            <h1>Where are you?</h1>

            <p className="step-description">
              Your location helps us show you people nearby.
            </p>

            <div className="location-box">

              <span className="location-icon">
                📍
              </span>

              <input
                type="text"
                name="location"
                placeholder="Enter your city"
                value={formData.location}
                onChange={handleChange}
              />

            </div>

            <button
              className="continue-btn"
              onClick={() => {
                console.log(formData);
              }}
            >
              Start Matching
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default UserDetail;