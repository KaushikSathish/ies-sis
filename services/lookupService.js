var lookupDao = require('../daos/lookupDao');
var appLogger = require('../logging/appLogger');
var validationInformationPath = require('../config/config.' + process.env.NODE_ENV).validationInformationPath
var validationRulesAndMessages = require(validationInformationPath);

function getLookupValues(key, callback) {
    lookupDao.getById({ key: key }, callback);
}

function addNewItemsIntoLookup(keyName, newValues, callback) {
    lookupDao.updateArrayByQuery({ key: keyName }, { values: { $each: newValues } }, callback);
}

function loadValidationRulesForAllForms(callback) {
    if (validationRulesAndMessages) {
        callback(null, validationRulesAndMessages);
    }
    else {
        callback(new Error('values not available'), null);
    }
}

module.exports.addNewItemsIntoLookup = addNewItemsIntoLookup;
module.exports.loadValidationRulesForAllForms = loadValidationRulesForAllForms;
module.exports.getLookupValues = getLookupValues;
