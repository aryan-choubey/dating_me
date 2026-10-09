import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetail.css";

import logo from "../assets/logo/logo.png";
import { userDetail } from "../api/allapi";

const UserDetail = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        interestedIn: "",
        bio: "",
        photos: [],
        interests: [],
        city: "",
        state: "",
        country: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalSteps = 5;

    // ===============================
    // HANDLE INPUT
    // ===============================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // ===============================
    // NEXT STEP
    // ===============================

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    // ===============================
    // PREVIOUS STEP
    // ===============================

    const previousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // ===============================
    // SELECT INTEREST
    // ===============================

    const handleInterest = (interest) => {
        setFormData((previousData) => {
            const alreadySelected =
                previousData.interests.includes(interest);

            if (alreadySelected) {
                return {
                    ...previousData,
                    interests: previousData.interests.filter(
                        (item) => item !== interest
                    ),
                };
            }

            return {
                ...previousData,
                interests: [
                    ...previousData.interests,
                    interest,
                ],
            };
        });
    };

    // ===============================
    // SELECT PHOTO
    // ===============================

    const handlePhotoChange = (index, file) => {
        if (!file) return;

        setFormData((previousData) => {
            const photos = [...previousData.photos];

            photos[index] = file;

            return {
                ...previousData,
                photos,
            };
        });
    };

    // ===============================
    // SUBMIT PROFILE
    // ===============================

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const data = new FormData();

            

            data.append("name", formData.name);
            data.append("gender", formData.gender);
            data.append(
                "interestedIn",
                formData.interestedIn
            );
            data.append("bio", formData.bio);

            

            data.append("city", formData.city);
            data.append("state", formData.state);
            data.append("country", formData.country);

            

            formData.interests.forEach((interest) => {
                data.append("interests", interest);
            });

            

            formData.photos.forEach((photo) => {
                if (photo) {
                    data.append("photos", photo);
                }
            });

            

            const response = await userDetail(data);

            console.log(
                "Profile updated:",
                response.data
            );

            

            navigate("/discover");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to complete your profile"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-detail-page">



            <div className="user-detail-header">

                <button
                    className="back-btn outside-back"
                    onClick={() => window.history.back()}
                >
                    ← Back
                </button>

                <img
                    src={logo}
                    alt="Logo"
                    className="user-detail-logo"
                />

                <div className="step-count">
                    {step} of {totalSteps}
                </div>

            </div>




            <div className="progress-container">

                <div
                    className="progress-bar"
                    style={{
                        width: `${(step / totalSteps) * 100}%`,
                    }}
                />

            </div>




            <div className="user-detail-card">

                {step > 1 && (
                    <button
                        className="card-back-btn"
                        onClick={previousStep}
                    >
                        ← Back
                    </button>
                )}




                {step === 1 && (
                    <div className="step-content">

                        <h1>Tell us about you</h1>

                        <p className="step-description">
                            Let's get to know you a little better.
                        </p>


                        {/* NAME */}

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

                            <label>I am</label>

                            <div className="option-row">

                                {[
                                    "male",
                                    "female",
                                    "other",
                                ].map((item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            formData.gender === item
                                                ? "option-btn active"
                                                : "option-btn"
                                        }
                                        onClick={() =>
                                            setFormData(
                                                (previousData) => ({
                                                    ...previousData,
                                                    gender: item,
                                                })
                                            )
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

                                {[
                                    "male",
                                    "female",
                                    "everyone",
                                ].map((item) => (

                                    <button
                                        type="button"
                                        key={item}
                                        className={
                                            formData.interestedIn === item
                                                ? "option-btn active"
                                                : "option-btn"
                                        }
                                        onClick={() =>
                                            setFormData(
                                                (previousData) => ({
                                                    ...previousData,
                                                    interestedIn: item,
                                                })
                                            )
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




                {step === 3 && (
                    <div className="step-content">

                        <h1>Add your photos</h1>

                        <p className="step-description">
                            Add some photos so people can get to know you.
                        </p>


                        <div className="photo-upload-area">

                            {[0, 1, 2, 3].map((index) => (

                                <label
                                    className="photo-box"
                                    key={index}
                                >

                                    {formData.photos[index] ? (

                                        <img
                                            src={URL.createObjectURL(
                                                formData.photos[index]
                                            )}
                                            alt="Preview"
                                        />

                                    ) : (
                                        "+"
                                    )}


                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            handlePhotoChange(
                                                index,
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                </label>

                            ))}

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
                                    type="button"
                                    key={interest}
                                    className={
                                        formData.interests.includes(
                                            interest
                                        )
                                            ? "interest-btn active"
                                            : "interest-btn"
                                    }
                                    onClick={() =>
                                        handleInterest(interest)
                                    }
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




                {step === 5 && (
                    <div className="step-content">

                        <h1>Where are you?</h1>

                        <p className="step-description">
                            Your location helps us show you people nearby.
                        </p>




                        <div className="form-group">

                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                placeholder="Enter your city"
                                value={formData.city}
                                onChange={handleChange}
                            />

                        </div>




                        <div className="form-group">

                            <label>State</label>

                            <input
                                type="text"
                                name="state"
                                placeholder="Enter your state"
                                value={formData.state}
                                onChange={handleChange}
                            />

                        </div>




                        <div className="form-group">

                            <label>Country</label>

                            <input
                                type="text"
                                name="country"
                                placeholder="Enter your country"
                                value={formData.country}
                                onChange={handleChange}
                            />

                        </div>




                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}




                        <button
                            className="continue-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Start Matching"
                            }
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};

export default UserDetail;