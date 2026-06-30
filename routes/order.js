const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Order = require('../models/Order');
const { generateInvoiceNumber, formatInvoiceMessage } = require('../utils/invoice');

const ALLOWED_STATUSES = ['pending', 'confirmed', 'fulfilled', 'cancelled'];

// Create a new order. Public on purpose — this is the checkout step, so
// customers aren't (and shouldn't need to be) authenticated as admins.
router.post("/", async (req, res, next) => {
    try {
        const { customer, items } = req.body;

        if (!customer || !customer.name || !customer.phone) {
            return next(createHttpError(400, 'Customer name and phone are required.'));
        }
        if (!Array.isArray(items) || items.length === 0) {
            return next(createHttpError(400, 'Order must include at least one item.'));
        }

        const totalPrice = items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
        );

        const order = new Order({
            invoiceNumber: generateInvoiceNumber(),
            customer,
            items,
            totalPrice
        });

        const saved = await order.save();

        res.status(201).json({
            success: true,
            message: "Order created",
            data: saved,
            // Ready-to-send text for the WhatsApp link — see formatInvoiceMessage.
            whatsappMessage: formatInvoiceMessage(saved)
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(createHttpError(409, 'Invoice number collision — please try again.'));
        }
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get all orders (admin)
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Look up an order by its invoice number — no auth required, so a customer
// (or you, from the WhatsApp message they sent) can pull it up directly.
router.get("/invoice/:invoiceNumber", async (req, res, next) => {
    try {
        const order = await Order.findOne({ invoiceNumber: req.params.invoiceNumber });
        if (!order) {
            return next(createHttpError(404, 'Order not found'));
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get a single order by ID (admin)
router.get("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const order = await Order.findById(id);
        if (!order) {
            return next(createHttpError(404, 'Order not found'));
        }
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update order status (admin) — e.g. mark confirmed once you've actioned
// the WhatsApp message
router.patch("/:id/status", verifyTokenAndAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    if (!ALLOWED_STATUSES.includes(status)) {
        return next(createHttpError(400, `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`));
    }

    try {
        const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) {
            return next(createHttpError(404, 'Order not found'));
        }
        res.status(200).json({ success: true, message: "Order status updated", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Marks the order as actually sent via WhatsApp. Called by the frontend
// right after it opens the wa.me link, so "created" and "sent" aren't
// conflated — a customer could close the cart without ever hitting send.
router.patch("/:id/sent", async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    try {
        const updated = await Order.findByIdAndUpdate(id, { sentVia: 'whatsapp' }, { new: true });
        if (!updated) {
            return next(createHttpError(404, 'Order not found'));
        }
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

module.exports = router;