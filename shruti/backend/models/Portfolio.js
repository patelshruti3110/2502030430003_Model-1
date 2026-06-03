const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    location: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    linkedinLink: {
        type: String,
    },
    theme: {
        type: String,
        default: 'dark',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
