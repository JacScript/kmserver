const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const createHttpError = require("http-errors");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const NespressoPage = require('../models/NespressoPage');
const NespressoMachine = require('../models/NespressoMachine');
const NespressoCapsule = require('../models/NespressoCapsule');
const NespressoAccessory = require('../models/NespressoAccessory');

const ALLOWED_SECTIONS = ['heroSection', 'sustainabilitySection', 'clubSection'];

// Maps the URL's :productType segment to the right model, for the
// link/unlink endpoints below.
const PRODUCT_MODELS = {
    machines: NespressoMachine,
    capsules: NespressoCapsule,
    accessories: NespressoAccessory
};

const POPULATE_FIELDS = ['machines', 'capsules', 'accessories'];

// Create or update the Nespresso page (singleton, like About/HolidayHomePage)
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        let page = await NespressoPage.findOne();

        if (page) {
            page = Object.assign(page, req.body);
            await page.save();
            return res.status(200).json({ success: true, message: "Nespresso page updated", data: page });
        }

        page = new NespressoPage(req.body);
        await page.save();
        res.status(201).json({ success: true, message: "Nespresso page created", data: page });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Get the page, with all linked products expanded in full
router.get("/", async (req, res, next) => {
    try {
        const page = await NespressoPage.findOne().populate(POPULATE_FIELDS);
        if (!page) {
            return next(createHttpError(404, 'Nespresso page not found'));
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
        const updated = await NespressoPage.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        }).populate(POPULATE_FIELDS);

        if (!updated) {
            return next(createHttpError(404, 'Nespresso page not found'));
        }
        res.status(200).json({ success: true, message: "Nespresso page updated", data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Update a single section by ID, without touching the rest of the page
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
        const updated = await NespressoPage.findByIdAndUpdate(
            id,
            { $set: { [sectionName]: req.body } },
            { new: true, runValidators: true }
        ).populate(POPULATE_FIELDS);

        if (!updated) {
            return next(createHttpError(404, 'Nespresso page not found'));
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

// Link a product to the page
// e.g. PATCH /api/nespresso-page/<pageId>/link/machines/<machineId>
router.patch("/:id/link/:productType/:productId", verifyTokenAndAdmin, async (req, res, next) => {
    const { id, productType, productId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(productId)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }

    const ProductModel = PRODUCT_MODELS[productType];
    if (!ProductModel) {
        return next(
            createHttpError(400, `Invalid product type. Must be one of: ${Object.keys(PRODUCT_MODELS).join(', ')}`)
        );
    }

    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return next(createHttpError(404, `${productType} item not found`));
        }

        const updated = await NespressoPage.findByIdAndUpdate(
            id,
            { $addToSet: { [productType]: productId } },
            { new: true }
        ).populate(POPULATE_FIELDS);

        if (!updated) {
            return next(createHttpError(404, 'Nespresso page not found'));
        }

        res.status(200).json({ success: true, message: `${productType} item linked`, data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Unlink a product from the page
router.delete("/:id/link/:productType/:productId", verifyTokenAndAdmin, async (req, res, next) => {
    const { id, productType, productId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(productId)) {
        return next(createHttpError(400, 'Invalid ID format'));
    }
    if (!PRODUCT_MODELS[productType]) {
        return next(
            createHttpError(400, `Invalid product type. Must be one of: ${Object.keys(PRODUCT_MODELS).join(', ')}`)
        );
    }

    try {
        const updated = await NespressoPage.findByIdAndUpdate(
            id,
            { $pull: { [productType]: productId } },
            { new: true }
        ).populate(POPULATE_FIELDS);

        if (!updated) {
            return next(createHttpError(404, 'Nespresso page not found'));
        }

        res.status(200).json({ success: true, message: `${productType} item unlinked`, data: updated });
    } catch (err) {
        console.error(err);
        return next(createHttpError(500, 'Internal server error'));
    }
});

// Also clean up references when a product is deleted directly, so the
// page never holds a dangling ID. Call this from each product's own
// delete route (see note below).
async function unlinkProductEverywhere(productType, productId) {
    await NespressoPage.updateMany({}, { $pull: { [productType]: productId } });
}

module.exports = router;
module.exports.unlinkProductEverywhere = unlinkProductEverywhere;