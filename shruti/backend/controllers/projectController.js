const Project = require('../models/Project');

// Add Project
exports.addProject = async (req, res) => {
    try {
        const title = req.body.title?.trim();
        const description = req.body.description?.trim();
        const technologies = req.body.technologies?.trim();
        const githubLink = req.body.githubLink?.trim();
        const liveLink = req.body.liveLink?.trim();
        const imageUrl = req.body.imageUrl?.trim();
        const userId = req.userId;

        // Validation
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const project = new Project({
            userId,
            title,
            description,
            technologies,
            githubLink,
            liveLink,
            imageUrl,
        });

        await project.save();

        res.status(201).json({
            message: 'Project added successfully',
            project,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Projects
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get One Project
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.userId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Projects (for public view)
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Projects by User ID (for public viewing)
exports.getProjectsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const projects = await Project.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, technologies, githubLink, liveLink, imageUrl, featured } = req.body;

        let project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const nextTitle = title !== undefined ? title.trim() : project.title;
        const nextDescription = description !== undefined ? description.trim() : project.description;

        if (!nextTitle || !nextDescription) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        project.title = nextTitle;
        project.description = nextDescription;
        project.technologies = technologies !== undefined ? technologies.trim() : project.technologies;
        project.githubLink = githubLink !== undefined ? githubLink.trim() : project.githubLink;
        project.liveLink = liveLink !== undefined ? liveLink.trim() : project.liveLink;
        project.imageUrl = imageUrl !== undefined ? imageUrl.trim() : project.imageUrl;
        project.featured = featured !== undefined ? featured : project.featured;
        project.updatedAt = Date.now();

        await project.save();

        res.status(200).json({
            message: 'Project updated successfully',
            project,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await Project.findByIdAndDelete(id);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
