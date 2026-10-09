import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
  userDetail,
  logoutApi,
} from "../api/allapi";

import "./Profile.css";

const SERVER_URL = "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    interestedIn: "",
    bio: "",
    interests: [],
    city: "",
    state: "",
    country: "",
  });

  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // =========================================
  // FETCH PROFILE
  // =========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyProfile();
      console.log("Response:", response);
console.log("Response data:", response.data);
console.log("Response user:", response.user);
      if (!response.success || !response.user) {
        setError(response.message || "Unable to load your profile.");
        return;
      }
        
      const profile = response.user;
        
      

      setUser(profile);

      

      setFormData({
        name: profile.name || "",
        dob: profile.dob
          ? new Date(profile.dob).toISOString().split("T")[0]
          : "",
        gender: profile.gender || "",
        interestedIn: profile.interestedIn || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
        city: profile.location?.city || "",
        state: profile.location?.state || "",
        country: profile.location?.country || "",
      });

      setPhotoPreviews(profile.photos || []);
    } catch (err) {
      console.error("Fetch profile error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================
  // IMAGE URL
  // =========================================

 const getPhotoUrl = (photo) => {
  if (!photo) return "";

  // Newly selected photos: display immediately
  if (photo.startsWith("blob:") || photo.startsWith("data:")) {
    return photo;
  }

  // Already complete URLs
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  // Existing photos stored on the backend
  return `${SERVER_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
};
  // =========================================
  // CALCULATE AGE
  // =========================================

  const calculateAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : null;
  };

  // =========================================
  // FORM INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // INTERESTS
  // =========================================

  const handleInterestChange = (event) => {
    const interests = event.target.value
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    setFormData((previous) => ({
      ...previous,
      interests,
    }));
  };

  // =========================================
  // PHOTO SELECTION
  // =========================================

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 5) {
      setError("You can select a maximum of 5 photos.");
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setError("Each photo must be an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setPhotoFiles(files);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setPhotoPreviews(previews);
  };

  // =========================================
  // CANCEL EDITING
  // =========================================

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPhotoFiles([]);
    setError("");
    setSuccess("");

    fetchProfile();
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("interestedIn", formData.interestedIn);
      data.append("bio", formData.bio);

      data.append(
        "interests",
        JSON.stringify(formData.interests)
      );

     data.append("city", formData.city);
            data.append("state", formData.state);
            data.append("country", formData.country);
      

      photoFiles.forEach((file) => {
        data.append("photos", file);
      });

      // Call your existing edit user-detail API.
      const response = await userDetail(data);

      if (!response.success) {
        setError(response.message || "Failed to update profile.");
        return;
      }

      setSuccess("Your profile has been updated successfully!");
      setIsEditing(false);
      setPhotoFiles([]);

      await fetchProfile();
    } catch (err) {
      console.error("Update profile error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setError("");

      // Call your existing logout API.
      await logoutApi();

      // Clear locally stored user data.
      localStorage.removeItem("user");

      // Redirect to login.
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div className="profile_page">
        <div className="profile_loading">
          <div className="profile_spinner"></div>
          <h3>Finding your spark...</h3>
          <p>Loading your profile</p>
        </div>
      </div>
    );
  }

  // =========================================
  // PROFILE ERROR
  // =========================================

  if (!user) {
    return (
      <div className="profile_page">
        <div className="profile_error_card">
          <div className="profile_error_icon">♡</div>

          <h2>Profile unavailable</h2>

          <p>{error || "Unable to load your profile."}</p>

          <button
            type="button"
            className="profile_primary_button"
            onClick={fetchProfile}
          >
            Try Again
          </button>

          <button
            type="button"
            className="profile_secondary_button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // DISPLAY DATA
  // =========================================

  const age = calculateAge(user.dob);

  const locationText = [
    user.location?.city,
    user.location?.state,
    user.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="profile_page">
      <div className="profile_container">

        {/* HEADER */}

        <div className="profile_heading">
          <div>
            <span className="profile_eyebrow">
              YOUR SOULSPARK SPACE
            </span>

            <h1>
              My <span>Profile</span>
            </h1>

            <p>
              Let your personality shine and show the world who you are.
            </p>
          </div>

          <div className="profile_heart_badge">♥</div>
        </div>

        {/* ALERT MESSAGES */}

        {error && (
          <div className="profile_message profile_message_error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile_message profile_message_success">
            {success}
          </div>
        )}

        {/* PROFILE CARD */}

        <div className="profile_main_card">

          {/* LEFT COLUMN */}

          <div className="profile_left">
            <div className="profile_photo_wrapper">
              {photoPreviews.length > 0 ? (
                <img
                  src={getPhotoUrl(
                    typeof photoPreviews[0] === "string"
                      ? photoPreviews[0]
                      : photoPreviews[0].url
                  )}
                  alt={user.name || "Profile"}
                  className="profile_main_photo"
                />
              ) : (
                <div className="profile_photo_placeholder">
                  {user.name?.charAt(0)?.toUpperCase() || "♡"}
                </div>
              )}

              <div className="profile_online_badge">
                <span></span>
                My Profile
              </div>
            </div>

            {!isEditing && (
              <>
                <div className="profile_identity">
                  <h2>{user.name || "Your Name"}</h2>

                  {age !== null && (
                    <span className="profile_age">
                      {age} years old
                    </span>
                  )}

                  {locationText && (
                    <p className="profile_location">
                      📍 {locationText}
                    </p>
                  )}

                  <div className="profile_identity_tags">
                    {user.gender && (
                      <span>
                        {user.gender.charAt(0).toUpperCase() +
                          user.gender.slice(1)}
                      </span>
                    )}

                    {user.interestedIn && (
                      <span>
                        Interested in{" "}
                        {user.interestedIn === "everyone"
                          ? "Everyone"
                          : user.interestedIn.charAt(0).toUpperCase() +
                            user.interestedIn.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="profile_primary_button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setIsEditing(true);
                  }}
                >
                  <span>✎</span>
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* RIGHT COLUMN */}

          <div className="profile_right">
            {isEditing ? (
              <form
                className="profile_edit_form"
                onSubmit={handleSaveProfile}
              >
                <div className="profile_section_heading">
                  <div className="profile_section_icon">✎</div>

                  <div>
                    <h3>Edit Your Profile</h3>
                    <p>Update your details and express yourself.</p>
                  </div>
                </div>

                {/* NAME */}

                <div className="profile_form_group">
                  <label htmlFor="profile-name">Full Name</label>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DOB AND GENDER */}

                <div className="profile_form_row">
                  <div className="profile_form_group">
                    <label htmlFor="profile-dob">
                      Date of Birth
                    </label>

                    <input
                      id="profile-dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="profile_form_group">
                    <label htmlFor="profile-gender">Gender</label>

                    <select
                      id="profile-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* PREFERENCE */}

                <div className="profile_form_group">
                  <label htmlFor="profile-interested">
                    Interested In
                  </label>

                  <select
                    id="profile-interested"
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleChange}
                  >
                    <option value="">Select preference</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="everyone">Everyone</option>
                  </select>
                </div>

                {/* BIO */}

                <div className="profile_form_group">
                  <label htmlFor="profile-bio">About Me</label>

                  <textarea
                    id="profile-bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell people something interesting about you..."
                  />
                </div>

                {/* INTERESTS */}

                <div className="profile_form_group">
                  <label htmlFor="profile-interests">
                    Interests
                  </label>

                  <input
                    id="profile-interests"
                    type="text"
                    value={formData.interests.join(", ")}
                    onChange={handleInterestChange}
                    placeholder="Music, Travel, Fitness"
                  />

                  <small>Separate interests with commas.</small>
                </div>

                {/* PHOTOS */}

                <div className="profile_form_group">
                  <label htmlFor="profile-photos">
                    Profile Photos
                  </label>

                  <input
                    id="profile-photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                  />

                  <small>
                    Select up to 5 photos. Choosing new photos replaces
                    the preview.
                  </small>
                </div>

                {photoPreviews.length > 0 && (
                  <div className="profile_photo_gallery">
                    {photoPreviews.map((photo, index) => (
                      <img
                        key={index}
                        src={getPhotoUrl(
                          typeof photo === "string" ? photo : photo.url
                        )}
                        alt={`Profile preview ${index + 1}`}
                        className="profile_gallery_photo"
                      />
                    ))}
                  </div>
                )}

                {/* LOCATION */}

                <div className="profile_form_group">
                  <label htmlFor="profile-city">City</label>

                  <input
                    id="profile-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile_form_row">
                  <div className="profile_form_group">
                    <label htmlFor="profile-state">State</label>

                    <input
                      id="profile-state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="profile_form_group">
                    <label htmlFor="profile-country">Country</label>

                    <input
                      id="profile-country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="profile_form_actions">
                  <button
                    type="button"
                    className="profile_secondary_button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile_primary_button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* ABOUT */}

                <section className="profile_section">
                  <div className="profile_section_heading">
                    <div className="profile_section_icon">♡</div>

                    <div>
                      <h3>About Me</h3>
                      <p>A little something about you</p>
                    </div>
                  </div>

                  <p className="profile_bio">
                    {user.bio?.trim() ||
                      "Your story starts here. Add a bio to let people know what makes you special."}
                  </p>
                </section>

                {/* INTERESTS */}

                <section className="profile_section">
                  <div className="profile_section_heading">
                    <div className="profile_section_icon">✦</div>

                    <div>
                      <h3>My Interests</h3>
                      <p>The things that make you, YOU</p>
                    </div>
                  </div>

                  {user.interests?.length > 0 ? (
                    <div className="profile_interests">
                      {user.interests.map((interest, index) => (
                        <span
                          className="profile_interest_tag"
                          key={`${interest}-${index}`}
                        >
                          <span>♡</span>
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="profile_empty_text">
                      No interests added yet.
                    </p>
                  )}
                </section>

                {/* PERSONAL DETAILS */}

                <section className="profile_section">
                  <div className="profile_section_heading">
                    <div className="profile_section_icon">✧</div>

                    <div>
                      <h3>Personal Details</h3>
                      <p>Your basic information</p>
                    </div>
                  </div>

                  <div className="profile_details_grid">
                    <div className="profile_detail_item">
                      <span className="profile_detail_label">
                        Full Name
                      </span>

                      <span className="profile_detail_value">
                        {user.name || "Not added"}
                      </span>
                    </div>

                    <div className="profile_detail_item">
                      <span className="profile_detail_label">
                        Email Address
                      </span>

                      <span className="profile_detail_value profile_email">
                        {user.email || "Not added"}
                      </span>
                    </div>

                    <div className="profile_detail_item">
                      <span className="profile_detail_label">
                        Date of Birth
                      </span>

                      <span className="profile_detail_value">
                        {user.dob
                          ? new Date(user.dob).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              timeZone: "UTC",
                            })
                          : "Not added"}
                      </span>
                    </div>

                    <div className="profile_detail_item">
                      <span className="profile_detail_label">
                        Gender
                      </span>

                      <span className="profile_detail_value">
                        {user.gender || "Not added"}
                      </span>
                    </div>
                  </div>
                </section>

                {/* LOCATION */}

                <section className="profile_section profile_location_section">
                  <div className="profile_section_heading">
                    <div className="profile_section_icon">⌖</div>

                    <div>
                      <h3>My Location</h3>
                      <p>Where your story begins</p>
                    </div>
                  </div>

                  <p className="profile_location_value">
                    {locationText || "Location not added yet"}
                  </p>
                </section>
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="profile_footer">
          <span>Made with ♥</span>

          <p>
            Your story is unique. Let SoulSpark help you find your connection.
          </p>
        </div>

        {/* LOGOUT */}

        {!isEditing && (
          <div className="profile_logout_container">
            <button
              type="button"
              className="profile_logout_button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <span className="profile_logout_icon">↪</span>

              {loggingOut ? "Logging out..." : "Logout"}
            </button>

            <p className="profile_logout_text">
              Ready to leave SoulSpark? You can always come back.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;