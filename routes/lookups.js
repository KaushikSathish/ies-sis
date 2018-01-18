var express = require('express');
var router = express.Router();
var lookupService = require('../services/lookupService');

router.get('/load/:key', function (req, res, next) {
    var key = req.params.key;
    lookupService.getLookupValues(key, function(err, lookupRecord) {
        if (!err) {
            if ((lookupRecord) && (lookupRecord.values)) {
                res.send(lookupRecord.values);
            } else {
                res.send([]);
            }
        } else {
            res.status(500).send({ name: err.name, message: err.message });
        }
    });
    
});

router.put('/:keyName', function (req, res, next) {
    var keyName = req.params.keyName;    
    var newValues = req.body.values;
    lookupService.addNewItemsIntoLookup(keyName, newValues, function (err, response) {
        if (!err) {
            res.send(response);
        }
        else {
            res.status(500).send({ name: err.name, message: err.message });
        }
    });
});

router.get('/validation/rules/messages', function (req, res, next) {
    lookupService.loadValidationRulesForAllForms(function(err, response) {
        if (!err) {
            res.send(response);
        }
        else {
            res.status(500).send({ name: err.name, message: err.message });
        }
    })
});


module.exports = router;