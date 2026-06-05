const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        templateId: {
            type: String,
            default: 'minimal',
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        summary: {
            type: String,
            required: true,
            trim: true,
        },
        skills: {
            type: String,
            trim: true,
        },
        experience: {
            type: String,
            trim: true,
        },
        education: {
            type: String,
            trim: true,
        },
        projects: {
            type: String,
            trim: true,
        },
        links: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
