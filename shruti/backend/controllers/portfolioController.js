const Portfolio = require('../models/Portfolio');

// Create or Update Portfolio
exports.createPortfolio = async (req, res) => {
    try {
        const fullName = req.body.fullName?.trim();
        const role = req.body.role?.trim();
        const about = req.body.about?.trim();
        const skills = req.body.skills?.trim();
        const email = req.body.email?.trim();
        const phone = req.body.phone?.trim();
        const location = req.body.location?.trim();
        const githubLink = req.body.githubLink?.trim();
        const linkedinLink = req.body.linkedinLink?.trim();
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
            portfolio.skills = skills !== undefined ? skills : portfolio.skills;
            portfolio.email = email !== undefined ? email : portfolio.email;
            portfolio.phone = phone !== undefined ? phone : portfolio.phone;
            portfolio.location = location !== undefined ? location : portfolio.location;
            portfolio.githubLink = githubLink !== undefined ? githubLink : portfolio.githubLink;
            portfolio.linkedinLink = linkedinLink !== undefined ? linkedinLink : portfolio.linkedinLink;
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
