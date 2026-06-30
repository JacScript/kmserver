const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const HomePage = require('../models/HomePage');
const createHttpError = require('http-errors');

const ALLOWED_SECTIONS = ['heroSection', 'discoverSection', 'whySection', 'featuredSections'];

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

// Update a single section of the homepage by ID, without touching the rest
// of the document. e.g. PATCH /api/homepage/<id>/section/heroSection
// with a body that's just the section's own fields (no need to resend
// title or the other three sections like the PUT route requires).
router.patch('/:id/section/:sectionName', verifyTokenAndAdmin, async (req, res, next) => {
    const { id, sectionName } = req.params;

    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    if (!ALLOWED_SECTIONS.includes(sectionName)) {
        return next(
            createHttpError(400, `Invalid section. Must be one of: ${ALLOWED_SECTIONS.join(', ')}`)
        );
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return next(createHttpError(400, 'Request body cannot be empty'));
    }

    try {
        const updatedHomePage = await HomePage.findByIdAndUpdate(
            id,
            { $set: { [sectionName]: req.body } },
            { new: true, runValidators: true }
        );

        if (!updatedHomePage) {
            return next(createHttpError(404, 'Homepage content not found'));
        }

        res.status(200).json({
            success: true,
            message: `${sectionName} updated successfully`,
            data: updatedHomePage
        });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;