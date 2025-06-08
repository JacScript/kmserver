const router = require('express').Router();
const Testimonial = require('../models/Testimonial');
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// ADD TESTIMONIAL
// @desc    Create a new testimonial
// @route   POST /testimonial
// @access  Private (Admin only)
router.post("/", verifyTokenAndAdmin, async (request, response, next) => {
  const { name, profileImg, description, flagImg } = request.body;

  try {
    // Validate input fields
    if (!name || !profileImg || !description || !flagImg) {
      const error = createHttpError(400, "All fields are required!!");
      return next(error);
    }

    // Create and save new testimonial to MongoDB
    const testimonial = await Testimonial.create({
      name,
      profileImg,
      description,
      flagImg
    });

    // Send success response
    response.status(201).json({
      success: true,
      message: "Testimonial successfully created.",
      data: { testimonial }
    });

  } catch (error) {
    // Log the error for debugging
    // console.error("Error creating testimonial:", error);

    // Pass a server error to global error handler without crashing
    const httpError = createHttpError(500, "Server error. Please try again.");
    next(httpError);
  }
});


// @desc    Get all testimonials
// @route   GET /testimonial
// @access  Public
router.get("/", async (request, response, next) => {
  try {
    // Fetch all testimonials from DB
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    // Respond with the data
    response.status(200).json({
      success: true,
      message: "Testimonials fetched successfully",
      data: testimonials,
    });
  } catch (error) {
    // Log error and pass to error handler middleware
    console.error("Error fetching testimonials:", error);
    next(createHttpError(500, "Unable to fetch testimonials. Please try again later."));
  }
});

// @desc    Update a testimonial
// @route   POST /testimonial/:id
// @access  Private (Admin Only)
router.put("/:id", verifyTokenAndAdmin, async (request, response, next) => {
  const { id } = request.params;
  const updateFields = request.body;

  try {
    // If no fields provided at all
    if (!Object.keys(updateFields).length) {
      return next(createHttpError(400, "No update fields provided"));
    }

    // Attempt to find and update the testimonial
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return next(createHttpError(404, "Testimonial not found"));
    }

    response.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error) {
    // console.error("Error updating testimonial:", error);
    next(createHttpError(500, "Failed to update testimonial"));
  }
});

module.exports = router;


module.exports = router;
