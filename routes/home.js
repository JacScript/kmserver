const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Home = require('../models/Home');
const createHttpError = require('http-errors');

// Create a new home listing
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
    const { type, images, price, title, subtitle, location, capacity, features, available, description } = req.body;

    try {
        if (!type || !images || !title || !price || !subtitle || !location || !capacity || !features ||  !available || !description) {
            return next(createHttpError(400, 'All fields are required'));
        }

        const newHome = new Home({
            type,
            images,
            title,
            price,
            subtitle,
            location,
            capacity,
            features,
            available,
            description
        });

        const savedHome = await newHome.save();
        res.status(201).json({ success: true, message: "Home listing created successfully", data: savedHome });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get all home listings
router.get('/', async (req, res, next) => {
    try {
        const homes = await Home.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: homes });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
}); 

// Get a home listing by ID
router.get('/:id', async (req, res, next) => {
  
    const { id } = req.params;

    try {
        const home = await Home.findById(id);
        if (!home) {
            return next(createHttpError(404, 'Home listing not found'));
        }
        res.status(200).json({ success: true, data: home });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update a home listing by ID
router.put('/:id',verifyTokenAndAdmin, async (req, res, next) => {          
    const { id } = req.params;
    const { type, images, price, title, subtitle, location, capacity, features, rating, available } = req.body;
    //  console.log("Updating home with ID:", req.params.id);
//   console.log("Update fields:", req.body);

    try {
        const updatedHome = await Home.findByIdAndUpdate(id, {
            type,
            images,
            price,
            title,
            subtitle,
            location,
            capacity,
            features,
            rating,
            available
        }, { new: true });

        if (!updatedHome) {
            return next(createHttpError(404, 'Home listing not found'));
        }

        res.status(200).json({ success: true, message: "Home listing updated successfully", data: updatedHome });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Delete a home listing by ID
router.delete('/:id', verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedHome = await Home.findByIdAndDelete(id);
        if (!deletedHome) {
            return next(createHttpError(404, 'Home listing not found'));
        }
        res.status(200).json({ success: true, message: "Home listing deleted successfully" });
    } catch (err) {
        // console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});     

module.exports = router;