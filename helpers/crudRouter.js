const expressRouter = require("express").Router;
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// Generates a standard create/list/get/update/delete router for a simple
// Mongoose model. Reads (GET) are public; writes require admin auth.
// Pass { autoLinkTo: { model, field } } to automatically $addToSet the new
// document's ID onto a singleton parent page (e.g. NespressoPage.machines)
// right after creation — avoids "created but never linked".
function createCrudRouter(Model, modelName, options = {}) {
    const router = expressRouter();
    const autoLinkTo = options.autoLinkTo || null;

    router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
        try {
            const doc = new Model(req.body);
            const saved = await doc.save();

            if (autoLinkTo) {
                await autoLinkTo.model.findOneAndUpdate(
                    {},
                    { $addToSet: { [autoLinkTo.field]: saved._id } }
                );
            }

            res.status(201).json({ success: true, message: `${modelName} created`, data: saved });
        } catch (err) {
            console.error(err);
            return next(createHttpError(500, 'Internal server error'));
        }
    });

        // Bulk-create multiple documents in one request.
    // Expects: { items: [ {...}, {...}, ... ] }
    // Returns: { success, message, data: [...saved docs], errors: [...validation failures] }
    // Uses insertMany with ordered:false so valid docs are saved even if some fail.
    // router.post("/bulk", verifyTokenAndAdmin, async (req, res, next) => {
    //     try {
    //         const { items } = req.body;

    //         if (!Array.isArray(items) || items.length === 0) {
    //             return next(createHttpError(400, '`items` must be a non-empty array'));
    //         }

    //         const result = await Model.insertMany(items, {
    //             ordered: false,        // don't abort on first error
    //             rawResult: true        // get the full WriteResult back
    //         });

    //         const saved = result.mongoose?.results
    //             ? result.mongoose.results.filter(r => r.error == null).map(r => r.doc)
    //             : await Model.find({ _id: { $in: Object.values(result.insertedIds) } });

    //         if (autoLinkTo && saved.length > 0) {
    //             await autoLinkTo.model.findOneAndUpdate(
    //                 {},
    //                 { $addToSet: { [autoLinkTo.field]: { $each: saved.map(d => d._id) } } }
    //             );
    //         }

    //         const writeErrors = result.mongoose?.results
    //             ? result.mongoose.results
    //                 .filter(r => r.error != null)
    //                 .map(r => ({ index: r.error.index, message: r.error.message }))
    //             : [];

    //         const statusCode = writeErrors.length === 0 ? 201 : 207; // 207 = partial success
    //         res.status(statusCode).json({
    //             success: true,
    //             message: `${saved.length} ${modelName}(s) created${writeErrors.length ? `, ${writeErrors.length} failed` : ''}`,
    //             data: saved,
    //             ...(writeErrors.length > 0 && { errors: writeErrors })
    //         });
    //     } catch (err) {
    //         // insertMany with ordered:false throws BulkWriteError but still persists valid docs
    //         if (err.name === 'BulkWriteError' || err.code === 11000) {
    //             const saved = await Model.find({ _id: { $in: Object.values(err.result?.insertedIds ?? {}) } });

    //             if (autoLinkTo && saved.length > 0) {
    //                 await autoLinkTo.model.findOneAndUpdate(
    //                     {},
    //                     { $addToSet: { [autoLinkTo.field]: { $each: saved.map(d => d._id) } } }
    //                 );
    //             }

    //             const writeErrors = (err.writeErrors ?? []).map(e => ({
    //                 index: e.index,
    //                 message: e.errmsg ?? e.message
    //             }));

    //             return res.status(207).json({
    //                 success: true,
    //                 message: `${saved.length} ${modelName}(s) created, ${writeErrors.length} failed`,
    //                 data: saved,
    //                 errors: writeErrors
    //             });
    //         }

    //         console.error(err);
    //         return next(createHttpError(500, 'Internal server error'));
    //     }
    // });

    router.get("/", async (req, res, next) => {
        try {
            const docs = await Model.find().sort({ createdAt: -1 });
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

            if (autoLinkTo) {
                await autoLinkTo.model.updateMany(
                    {},
                    { $pull: { [autoLinkTo.field]: id } }
                );
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