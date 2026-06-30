const createCrudRouter = require('../helpers/gallerycrudrouter');
const GalleryCategory = require('../models/GalleryCategory');

module.exports = createCrudRouter(GalleryCategory, 'Category', {
    defaultSort: { order: 1 }
});