const createCrudRouter = require('../helpers/crudrouter');
const NespressoMachine = require('../models/NespressoMachine');

const NespressoPage = require('../models/NespressoPage');
module.exports = createCrudRouter(NespressoMachine, 'Machine', {
    autoLinkTo: { model: NespressoPage, field: 'machines' }
});