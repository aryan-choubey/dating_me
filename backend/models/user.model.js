const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // =========================
        // ACCOUNT
        // =========================

        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        // =========================
        // PROFILE
        // =========================

        dob: {
            type: Date,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        interestedIn: {
            type: String,
            enum: ["male", "female", "everyone"],
        },

        bio: {
            type: String,
            maxlength: 500,
            trim: true,
        },

        // =========================
        // PHOTOS
        // =========================

        photos: [
            {
                type: String,
            },
        ],

        // =========================
        // INTERESTS
        // =========================

        interests: [
            {
                type: String,
                trim: true,
            },
        ],

        // =========================
        // LOCATION
        // =========================

        location: {
            city: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },

            country: {
                type: String,
                trim: true,
            },
        },

        // =========================
        // PROFILE STATUS
        // =========================

        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;