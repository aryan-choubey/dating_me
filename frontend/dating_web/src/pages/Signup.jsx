import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../api/allapi";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
       
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.password 
            
        ) {
            setError("Please fill all fields");
            return;
        }

        

        try {
            setLoading(true);

            const response = await signupApi({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            console.log("Signup successful:", response.data);

            // JWT is handled by the httpOnly cookie from backend.
            navigate("/userdetail");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">

            {/* ================= BACK BUTTON ================= */}

            <button
                className="signup-back-button"
                onClick={() => navigate("/")}
            >
                <span>←</span>
                Back
            </button>


            {/* ================= SIGNUP CARD ================= */}

            <div className="signup-card">

                {/* ================= LEFT SIDE ================= */}

                <div className="signup-left">

                    {/* Logo */}

                    <div className="signup-logo">

                        <div className="signup-logo-icon">
                            ♥
                        </div>

                        <span>SoulSpark</span>

                    </div>


                    {/* Bottom Content */}

                    <div className="signup-welcome">

                        <p className="signup-small-text">
                            WELCOME TO SOULSPARK
                        </p>

                        <h1>
                            Where
                            <br />
                            souls connect.
                        </h1>

                        <p className="signup-left-description">
                            Discover meaningful connections with
                            people who truly understand you.
                        </p>

                    </div>


                    {/* Decorative Hearts */}

                    <span className="signup-decoration heart-one">
                        ♥
                    </span>

                    <span className="signup-decoration heart-two">
                        ♥
                    </span>

                    <span className="signup-decoration heart-three">
                        ♥
                    </span>

                </div>


                {/* ================= RIGHT SIDE ================= */}

                <div className="signup-right">

                    <div className="signup-form-container">

                        <div className="signup-heading">

                            <h2>
                                Create your account
                            </h2>

                            <p>
                                Start your journey with SoulSpark
                            </p>

                        </div>


                        <form
                            className="signup-form"
                            onSubmit={handleSubmit}
                        >

                            {/* NAME */}

                            <div className="signup-input-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="signup-input-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="signup-input-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                            </div>




                            {/* ERROR */}

                            {error && (
                                <div className="signup-error">
                                    {error}
                                </div>
                            )}


                            {/* BUTTON */}

                            <button
                                type="submit"
                                className="signup-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create Account"
                                }

                                {!loading && (
                                    <span>→</span>
                                )}
                            </button>

                        </form>


                        {/* LOGIN */}

                        <div className="signup-login">

                            <span>
                                Already have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Signup;