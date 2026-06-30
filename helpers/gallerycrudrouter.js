const expressRouter = require("express").Router;
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// Generates a standard create/list/get/update/delete router for a simple
// Mongoose model. Reads (GET) are public; writes require admin auth.
// Pass { defaultSort } to change how GET / sorts — defaults to newest first.
function createCrudRouter(Model, modelName, options = {}) {
    const router = expressRouter();
    const defaultSort = options.defaultSort || { createdAt: -1 };

    router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
        try {
            // Accept either a single object or an array of objects, so a
            // whole sample-data file can be posted in one request.
            if (Array.isArray(req.body)) {
                const saved = await Model.insertMany(req.body);
                return res.status(201).json({
                    success: true,
                    message: `${modelName} items created`,
                    data: saved
                });
            }

            const doc = new Model(req.body);
            const saved = await doc.save();
            res.status(201).json({ success: true, message: `${modelName} created`, data: saved });
        } catch (err) {
            console.error(err);
            return next(createHttpError(500, 'Internal server error'));
        }
    });

    router.get("/", async (req, res, next) => {
        try {
            const docs = await Model.find().sort(defaultSort);
            res.status(200).json({ success: true, data: docs });
        } catch (err) {
            console.error(err);
            return next(createHttpError(500, 'Internal server error'));
        }
    });

    router.get("/:id", async (req, res, next) => {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next(createHttpError(400, 'Invalid ID format'));
        }
        try {
            const doc = await Model.findById(id);
            if (!doc) {
                return next(createHttpError(404, `${modelName} not found`));
            }
            res.status(200).json({ success: true, data: doc });
        } catch (err) {
            console.error(err);
            return next(createHttpError(500, 'Internal server error'));
        }
    });

    router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next(createHttpError(400, 'Invalid ID format'));
        }
        try {
            const updated = await Model.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });
            if (!updated) {
                return next(createHttpError(404, `${modelName} not found`));
            }
            res.status(200).json({ success: true, message: `${modelName} updated`, data: updated });
        } catch (err) {
            console.error(err);
            return next(createHttpError(500, 'Internal server error'));
        }
    });

    router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return next(createHttpError(400, 'Invalid ID format'));
        }
        try {
            const deleted = await Model.findByIdAndDelete(id);
            if (!deleted) {
                return next(createHttpError(404, `${modelName} not found`));
            }
            res.status(200).json({ success: true, message: `${modelName} deleted` });
        } catch (err) {
            console.error(err);
            return next(createHttpError(500, 'Internal server error'));
        }
    });

    return router;
}

module.exports = createCrudRouter;