const router = require("express").Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const Request = require('../models/Request');
const createHttpError = require("http-errors");

// Create a new request
router.post("/", async (req, res, next) => {
  const { destination, activity, email } = req.body;

  try {
    if (!destination || !activity|| !email) {
      return next(createHttpError(400, 'All fields are required'));
    }

    const newRequest = new Request({
      destination,
      activity,
      email
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({ success: true, message: "Request created successfully", data: savedRequest });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, 'Internal server error'));
  }
});

// Get all requests
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, 'Internal server error'));
  }
});


module.exports = router;