import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/allapi";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

        if (!formData.email || !formData.password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await loginApi({
                email: formData.email,
                password: formData.password,
            });

            console.log("Login successful:", response.data);

            // JWT is handled by httpOnly cookie
            navigate("/discover");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <button
                className="login-back-button"
                onClick={() => navigate(-1)}
            >
                <span>←</span>
                Back
            </button>

            <div className="login-card">

                {/* LEFT SIDE */}
                <div className="login-left">

                    <div className="login-logo">
                        <div className="login-logo-icon">
                            ♥
                        </div>

                        <span>SoulSpark</span>
                    </div>

                    <div className="login-welcome">

                        <p className="login-small-text">
                            WELCOME BACK
                        </p>

                        <h1>
                            Where
                            <br />
                            souls connect.
                        </h1>

                        <p className="login-left-description">
                            Your next meaningful connection
                            could be just one login away.
                        </p>

                    </div>

                    <span className="login-decoration login-heart-one">
                        ♥
                    </span>

                    <span className="login-decoration login-heart-two">
                        ♥
                    </span>

                    <span className="login-decoration login-heart-three">
                        ♥
                    </span>

                </div>

                {/* RIGHT SIDE */}
                <div className="login-right">

                    <div className="login-form-container">

                        <div className="login-heading">
                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Login to continue your SoulSpark journey
                            </p>
                        </div>

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* EMAIL */}
                            <div className="login-input-group">

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
                            <div className="login-input-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                            </div>

                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                className="logins-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"
                                }

                                {!loading && (
                                    <span>→</span>
                                )}

                            </button>

                        </form>

                        <div className="login-signup">

                            <span>
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                            >
                                Sign up
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;