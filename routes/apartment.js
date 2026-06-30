const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Apartment = require('../models/Apartment');
const HolidayHomePage = require('../models/HolidayHome');

// Create a new apartment listing
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const apartment = new Apartment(req.body);
        const saved = await apartment.save();

        // Auto-link to the Holiday Home page so new apartments show up
        // immediately, without a separate manual linking step.
        await HolidayHomePage.findOneAndUpdate(
            {},
            { $addToSet: { 'listingsSection.apartments': saved._id } }
        );

        res.status(201).json({ success: true, message: "Apartment created", data: saved });
    } catch (err) {
        if (err.code === 11000) {
            return next(createHttpError(409, 'An apartment with this slug already exists.'));
        }
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get all apartments
router.get("/", async (req, res, next) => {
    try {
        const apartments = await Apartment.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: apartments });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get a single apartment by its slug — used by the public detail page
router.get("/slug/:slug", async (req, res, next) => {
    try {
        const apartment = await Apartment.findOne({ slug: req.params.slug });
        if (!apartment) {
            return next(createHttpError(404, 'Apartment not found'));
        }
        res.status(200).json({ success: true, data: apartment });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get a single apartment by ID
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const apartment = await Apartment.findById(id);
        if (!apartment) {
            return next(createHttpError(404, 'Apartment not found'));
        }
        res.status(200).json({ success: true, data: apartment });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update an apartment by ID
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const updated = await Apartment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            return next(createHttpError(404, 'Apartment not found'));
        }
        res.status(200).json({ success: true, message: "Apartment updated", data: updated });
    } catch (err) {
        if (err.code === 11000) {
            return next(createHttpError(409, 'An apartment with this slug already exists.'));
        }
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Delete an apartment by ID, and unlink it from any Holiday Home page
// that was referencing it so no broken IDs are left behind.
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const deleted = await Apartment.findByIdAndDelete(id);
        if (!deleted) {
            return next(createHttpError(404, 'Apartment not found'));
        }

        await HolidayHomePage.updateMany(
            {},
            { $pull: { 'listingsSection.apartments': id } }
        );

        res.status(200).json({ success: true, message: "Apartment deleted" });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;