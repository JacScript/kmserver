const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const GalleryPage = require('../models/GalleryPage');

// Create or update the Gallery page (singleton, like About)
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        let page = await GalleryPage.findOne();

        if (page) {
            page = Object.assign(page, req.body);
            await page.save();
            return res.status(200).json({ success: true, message: "Gallery page updated", data: page });
        }

        page = new GalleryPage(req.body);
        await page.save();
        res.status(201).json({ success: true, message: "Gallery page created", data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get the Gallery page
router.get("/", async (req, res, next) => {
    try {
        const page = await GalleryPage.findOne();
        if (!page) {
            return next(createHttpError(404, 'Gallery page not found'));
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
        const updated = await GalleryPage.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            return next(createHttpError(404, 'Gallery page not found'));
        }
        res.status(200).json({ success: true, message: "Gallery page updated", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;