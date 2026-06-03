const Portfolio = require('../models/Portfolio');

// Create or Update Portfolio
exports.createPortfolio = async (req, res) => {
    try {
        const { fullName, role, about, skills, email, phone, location, githubLink, linkedinLink } = req.body;
        const userId = req.userId;

        // Validation
        if (!fullName || !role || !about) {
            return res.status(400).json({ message: 'Please provide required fields' });
        }

        // Check if portfolio already exists
        let portfolio = await Portfolio.findOne({ userId });

        if (portfolio) {
            // Update existing portfolio
            portfolio.fullName = fullName || portfolio.fullName;
            portfolio.role = role || portfolio.role;
            portfolio.about = about || portfolio.about;
            portfolio.skills = skills || portfolio.skills;
            portfolio.email = email || portfolio.email;
            portfolio.phone = phone || portfolio.phone;
            portfolio.location = location || portfolio.location;
            portfolio.githubLink = githubLink || portfolio.githubLink;
            portfolio.linkedinLink = linkedinLink || portfolio.linkedinLink;
            portfolio.updatedAt = Date.now();

            await portfolio.save();
            return res.status(200).json({
                message: 'Portfolio updated successfully',
                portfolio,
            });
        }

        // Create new portfolio
        portfolio = new Portfolio({
            userId,
            fullName,
            role,
            about,
            skills,
            email,
            phone,
            location,
            githubLink,
            linkedinLink,
        });

        await portfolio.save();

        res.status(201).json({
            message: 'Portfolio created successfully',
            portfolio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Portfolio
exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.userId });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Portfolio by User ID (for public viewing)
exports.getPortfolioByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const portfolio = await Portfolio.findOne({ userId });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
