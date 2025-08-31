const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
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
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get the latest homepage content
router.get('/', async (req, res, next) => {
    try {
        const homePageContent = await HomePage.find().sort({ createdAt: -1 }).limit(1);
        if (!homePageContent || homePageContent.length === 0) {
            return next(createHttpError(404, 'Homepage content not found'));
        }
        res.status(200).json({ success: true, data: homePageContent[0] });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

//Get homepage content by ID
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    try {
        const homePageContent = await HomePage.findById(id);
        if (!homePageContent) {
            return next(createHttpError(404, 'Homepage content not found'));
        }
        res.status(200).json({ success: true, data: homePageContent });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update homepage content by ID
router.put('/:id', verifyTokenAndAdmin, async (req, res, next) => {
   // console.log("Update request body:", req.body); // Debugging line
    const { id } = req.params;

      // Validate if ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    const { title, heroSection, discoverSection, whySection, featuredSections } = req.body;

    try {
        const updatedHomePage = await HomePage.findByIdAndUpdate(id, {
            title,
            heroSection,
            discoverSection,
            whySection,
            featuredSections
        }, { new: true });

        if (!updatedHomePage) {
            return next(createHttpError(404, 'Homepage content not found'));
        }

        res.status(200).json({ success: true, message: "Homepage content updated successfully", data: updatedHomePage });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;