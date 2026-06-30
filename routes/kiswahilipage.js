const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const KiswahiliPage = require('../models/KiswahiliPage');

const ALLOWED_SECTIONS = ['heroSection', 'featuresSection', 'masterySection', 'ctaSection'];

// Create or update the Kiswahili page (singleton, like About)
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        let page = await KiswahiliPage.findOne();

        if (page) {
            page = Object.assign(page, req.body);
            await page.save();
            return res.status(200).json({ success: true, message: "Kiswahili page updated", data: page });
        }

        page = new KiswahiliPage(req.body);
        await page.save();
        res.status(201).json({ success: true, message: "Kiswahili page created", data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get the Kiswahili page
router.get("/", async (req, res, next) => {
    try {
        const page = await KiswahiliPage.findOne();
        if (!page) {
            return next(createHttpError(404, 'Kiswahili page not found'));
        }
        res.status(200).json({ success: true, data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get by ID
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const page = await KiswahiliPage.findById(id);
        if (!page) {
            return next(createHttpError(404, 'Kiswahili page not found'));
        }
        res.status(200).json({ success: true, data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Full update by ID
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const updated = await KiswahiliPage.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            return next(createHttpError(404, 'Kiswahili page not found'));
        }
        res.status(200).json({ success: true, message: "Kiswahili page updated", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update a single section by ID, without touching the rest of the page
// e.g. PATCH /api/kiswahili-page/<id>/section/masterySection
router.patch("/:id/section/:sectionName", verifyTokenAndAdmin, async (req, res, next) => {
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
        const updated = await KiswahiliPage.findByIdAndUpdate(
            id,
            { $set: { [sectionName]: req.body } },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return next(createHttpError(404, 'Kiswahili page not found'));
        }

        res.status(200).json({
            success: true,
            message: `${sectionName} updated successfully`,
            data: updated
        });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;