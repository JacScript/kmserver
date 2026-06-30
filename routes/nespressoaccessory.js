const createCrudRouter = require('../helpers/crudRouter');
const NespressoAccessory = require('../models/NespressoAccessory');
const NespressoPage = require('../models/NespressoPage');

module.exports = createCrudRouter(NespressoAccessory, 'Accessory', {
    autoLinkTo: { model: NespressoPage, field: 'accessories' }
});