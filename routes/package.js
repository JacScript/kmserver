const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Package = require('../models/Package');
const createHttpError = require('http-errors');

// Create a new package
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
  console.log('Creating a new package with data:', req.body);
  const {
    title,
    subtitle,
    price,
    priceNote,
    images,
    description,
    longDescription,
    features,
    color,
    bgColor,
    duration
  } = req.body;

  try {
    if (!title || !subtitle || !price || !images || !description) {
      return next(createHttpError(400, 'Title, subtitle, price, images, and description are required.'));
    }

    const newPackage = new Package({
      title,
      subtitle,
      price,
      priceNote,
      images,
      description,
      longDescription,
      features,
      color,
      bgColor
    });

    const savedPackage = await newPackage.save();

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: savedPackage
    });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, 'Internal server error'));
  }
}); // ✅ Fixed: Added closing parenthesis here



//get all packages
router.get('/', async (req, res, next) => {
  try {
    const packages = await Package.find();
    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, 'Internal server error'));
  }
});

// Update a packages listing by ID
router.put('/:id',verifyTokenAndAdmin, async (req, res, next) => {          
    const { id } = req.params;
    const {
    title,
    subtitle,
    price,
    priceNote,
    images,
    description,
    longDescription,
    features,
    color,
    bgColor,
    duration} = req.body;
     console.log("Updating packages with ID:", req.params.id);
  console.log("Update fields:", req.body);

    try {
        const updatedPackage = await Package.findByIdAndUpdate(id, {
            title,
    subtitle,
    price,
    priceNote,
    images,
    description,
    longDescription,
    features,
    color,
    bgColor,
    duration
        }, { new: true });

        if (!updatedPackage) {
            return next(createHttpError(404, 'Home listing not found'));
        }

        res.status(200).json({ success: true, message: "Home listing updated successfully", data: updatedPackage });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});


module.exports = router;
