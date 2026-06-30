const router = require("express").Router();
const About = require('../models/About');
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const { isValidObjectId } = require("mongoose");

const ALLOWED_SECTIONS = ['mainContent', 'whoweareSection', 'valueSection'];

// Create or Update About Information
router.post("/", verifyTokenAndAdmin, async (request, response, next) => {
    try {
        const aboutData = request.body;

        // Check if an About document already exists
        let about = await About.findOne();

        if (about) {
            // Update existing document
            about = Object.assign(about, aboutData);
            await about.save();
            return response.status(200).json({ success: true, message: "About information updated", data: about });
        } else {
            // Create new document
            about = new About(aboutData);
            await about.save();
            return response.status(201).json({ success: true, message: "About information created", data: about });
        }
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get About Information
router.get("/", async (request, response, next) => {
    try {
        const about = await About.findOne();
        if (!about) {
            return next(createHttpError(404, 'About information not found'));
        }
        response.status(200).json({ success: true, data: about });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});


// Delete About Information
router.delete("/", verifyTokenAndAdmin, async (request, response, next) => {
    try {
        const about = await About.findOne();
        if (!about) {
            return next(createHttpError(404, 'About information not found'));
        }
        await about.remove();
        response.status(200).json({ success: true, message: "About information deleted" });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

//update about sections
router.put("/:id", verifyTokenAndAdmin, async (request, response, next) => {
    // console.log("Update request body:", request.body); // Debugging line

        const aboutId = request.params.id;
    
    // Validate if ID is a valid MongoDB ObjectId
        if (!isValidObjectId(aboutId)) {
            return next(createHttpError(400, 'Invalid ID format'));
        }


    try {
        const updateData = request.body;

        const about = await About.findByIdAndUpdate(aboutId, updateData, { new: true });
        if (!about) {
            return next(createHttpError(404, 'About information not found'));
        }
        response.status(200).json({ success: true, message: "About information updated", data: about });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update a single section of the About document by ID, without touching
// the rest of it. e.g. PATCH /api/about/<id>/section/whoweareSection
// - mainContent / whoweareSection expect an object body (the section's own fields)
// - valueSection expects an array body, since that section is an array itself
router.patch("/:id/section/:sectionName", verifyTokenAndAdmin, async (request, response, next) => {
    const { id, sectionName } = request.params;

    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    if (!ALLOWED_SECTIONS.includes(sectionName)) {
        return next(
            createHttpError(400, `Invalid section. Must be one of: ${ALLOWED_SECTIONS.join(', ')}`)
        );
    }

    const isEmptyBody =
        request.body === undefined ||
        request.body === null ||
        (typeof request.body === "object" && Object.keys(request.body).length === 0);

    if (isEmptyBody) {
        return next(createHttpError(400, 'Request body cannot be empty'));
    }

    try {
        const updatedAbout = await About.findByIdAndUpdate(
            id,
            { $set: { [sectionName]: request.body } },
            { new: true, runValidators: true }
        );

        if (!updatedAbout) {
            return next(createHttpError(404, 'About information not found'));
        }

        response.status(200).json({
            success: true,
            message: `${sectionName} updated successfully`,
            data: updatedAbout
        });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

//gget about by id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    try {
        const about = await About.findById(id);
        if (!about) {
            return next(createHttpError(404, 'About information not found'));
        }
        res.status(200).json({ success: true, data: about });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;