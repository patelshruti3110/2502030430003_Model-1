const Resume = require('../models/Resume');

const editableFields = [
    'templateId',
    'title',
    'fullName',
    'role',
    'email',
    'phone',
    'location',
    'summary',
    'skills',
    'experience',
    'education',
    'projects',
    'links',
];

function buildResumePayload(body) {
    return editableFields.reduce((payload, field) => {
        if (body[field] !== undefined) {
            payload[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
        }
        return payload;
    }, {});
}

function validateResume(payload) {
    if (!payload.fullName) return 'Full name is required';
    if (!payload.role) return 'Role is required';
    if (!payload.summary) return 'Professional summary is required';
    return '';
}

exports.createResume = async (req, res) => {
    try {
        const payload = buildResumePayload(req.body);
        const validationError = validateResume(payload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const resume = new Resume({
            ...payload,
            userId: req.userId,
            title: payload.title || `${payload.fullName} Resume`,
        });

        await resume.save();
        res.status(201).json({ message: 'Resume created successfully', resume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const payload = buildResumePayload(req.body);
        const nextResume = { ...resume.toObject(), ...payload };
        const validationError = validateResume(nextResume);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        editableFields.forEach((field) => {
            if (payload[field] !== undefined) resume[field] = payload[field];
        });

        await resume.save();
        res.status(200).json({ message: 'Resume updated successfully', resume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
