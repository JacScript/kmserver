const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Photo = require('../models/Photo');

// Create a photo — accepts either a single object or an array of objects
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        if (Array.isArray(req.body)) {
            const saved = await Photo.insertMany(req.body);
            return res.status(201).json({ success: true, message: "Photos created", data: saved });
        }

        const photo = new Photo(req.body);
        const saved = await photo.save();
        res.status(201).json({ success: true, message: "Photo created", data: saved });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get all photos, optionally filtered by category: GET /api/photos?category=paris
// Matches the frontend's activeFilter — "all" (or no query) returns everything.
router.get("/", async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category.toLowerCase();
        }

        const photos = await Photo.find(filter).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: photos });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get a single photo by ID
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const photo = await Photo.findById(id);
        if (!photo) {
            return next(createHttpError(404, 'Photo not found'));
        }
        res.status(200).json({ success: true, data: photo });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update a photo by ID
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const updated = await Photo.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            return next(createHttpError(404, 'Photo not found'));
        }
        res.status(200).json({ success: true, message: "Photo updated", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Delete a photo by ID
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const deleted = await Photo.findByIdAndDelete(id);
        if (!deleted) {
            return next(createHttpError(404, 'Photo not found'));
        }
        res.status(200).json({ success: true, message: "Photo deleted" });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;