const createCrudRouter = require('../helpers/crudRouter');
const NespressoCapsule = require('../models/NespressoCapsule');

const NespressoPage = require('../models/NespressoPage');

module.exports = createCrudRouter(NespressoCapsule, 'Capsule', {
    autoLinkTo: { model: NespressoPage, field: 'capsules' }
});