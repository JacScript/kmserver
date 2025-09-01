const router = require("express").Router();
const About = require('../models/About');
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const { isValidObjectId } = require("mongoose");

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