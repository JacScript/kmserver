const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const HomePage = require('../models/HomePage');
const createHttpError = require('http-errors');

// Create homepage content
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
    const { title, heroSection, discoverSection, whySection, featuredSections } = req.body;

    try {
        if (!title || !heroSection || !discoverSection || !whySection || !featuredSections) {
            return next(createHttpError(400, 'All fields are required'));
        }

        const newHomePage = new HomePage({
            title,
            heroSection,
            discoverSection,
            whySection,
            featuredSections
        });

        const savedHomePage = await newHomePage.save();
        res.status(201).json({ success: true, message: "Homepage content created successfully", data: savedHomePage });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});