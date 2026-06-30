const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const HolidayHomePage = require('../models/HolidayHome');
const Apartment = require('../models/Apartment');

const ALLOWED_SECTIONS = ['heroSection', 'listingsSection'];

// Create or update the Holiday Home page (singleton, like About)
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        let page = await HolidayHomePage.findOne();

        if (page) {
            page = Object.assign(page, req.body);
            await page.save();
            return res.status(200).json({ success: true, message: "Holiday Home page updated", data: page });
        }

        page = new HolidayHomePage(req.body);
        await page.save();
        res.status(201).json({ success: true, message: "Holiday Home page created", data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get the Holiday Home page, with linked apartments expanded in full
router.get("/", async (req, res, next) => {
    try {
        const page = await HolidayHomePage.findOne().populate('listingsSection.apartments');
        if (!page) {
            return next(createHttpError(404, 'Holiday Home page not found'));
        }
        res.status(200).json({ success: true, data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get by ID, also populated
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const page = await HolidayHomePage.findById(id).populate('listingsSection.apartments');
        if (!page) {
            return next(createHttpError(404, 'Holiday Home page not found'));
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
        const updated = await HolidayHomePage.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        }).populate('listingsSection.apartments');

        if (!updated) {
            return next(createHttpError(404, 'Holiday Home page not found'));
        }
        res.status(200).json({ success: true, message: "Holiday Home page updated", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update a single section (heroSection or listingsSection) by ID, without
// touching the rest of the page.
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
        const updated = await HolidayHomePage.findByIdAndUpdate(
            id,
            { $set: { [sectionName]: req.body } },
            { new: true, runValidators: true }
        ).populate('listingsSection.apartments');

        if (!updated) {
            return next(createHttpError(404, 'Holiday Home page not found'));
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

// Link an apartment to this page (adds its ID to listingsSection.apartments)
// e.g. PATCH /api/holiday-home/<pageId>/apartments/<apartmentId>
router.patch("/:id/apartments/:apartmentId", verifyTokenAndAdmin, async (req, res, next) => {
    const { id, apartmentId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(apartmentId)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    try {
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
            return next(createHttpError(404, 'Apartment not found'));
        }

        const updated = await HolidayHomePage.findByIdAndUpdate(
            id,
            // $addToSet avoids linking the same apartment twice
            { $addToSet: { 'listingsSection.apartments': apartmentId } },
            { new: true }
        ).populate('listingsSection.apartments');

        if (!updated) {
            return next(createHttpError(404, 'Holiday Home page not found'));
        }

        res.status(200).json({ success: true, message: "Apartment linked", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Unlink an apartment from this page
// e.g. DELETE /api/holiday-home/<pageId>/apartments/<apartmentId>
router.delete("/:id/apartments/:apartmentId", verifyTokenAndAdmin, async (req, res, next) => {
    const { id, apartmentId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(apartmentId)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    try {
        const updated = await HolidayHomePage.findByIdAndUpdate(
            id,
            { $pull: { 'listingsSection.apartments': apartmentId } },
            { new: true }
        ).populate('listingsSection.apartments');

        if (!updated) {
            return next(createHttpError(404, 'Holiday Home page not found'));
        }

        res.status(200).json({ success: true, message: "Apartment unlinked", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;