
(function () {
    'use strict';
    var App = angular.module('app');
    App.service('studentService', studentService);
    studentService.$inject = ['$http', '$resource'];

    /**
     * RegExp when serialized as part of JSON.stringify gives empty object. This function is to avoid it and send it as RegExp string
     * @param {*} key 
     * @param {*} value 
     */
    function stringifyFilter(key, value) {
        if (value instanceof RegExp) {
            return value.toString();
        }
        return value;
    }
    /**
     * student service to perform CRUD operation on students. As the list of students are less, no need to search on the server side. Search will be done on client side by caching the list of students
     *  
     * @param {*} resource 
     */
    function studentService($http, $resource) {
        this.getAllStudents = function (callback) {
            var studentIdentity = $resource("/students");
            var studentInfo = studentIdentity.query(function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };

        this.queryStudents = function (filterQuery, callback) {
            var responsePromise = $http({
                method: 'POST',
                data: JSON.stringify({ criteria: filterQuery }, stringifyFilter),
                headers: { 'Content-Type': 'application/json' },
                url: '/students/filter'
            });

            responsePromise.then(function (responseData) {
                callback(null, responseData.data);
            }, function (error) {
                callback(error, null);
            });
        };


        this.getStudentByNameWithProjection = function (query, callback) {
            //TODO currently relying on student name to serve as student Id. Needs to be revisited
            var studentIdentity = $resource("/students/projection/name/:fullName");
            var studentInfo = studentIdentity.query({ criteria: query }, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };


        this.getStudentByIdWithProjection = function (rollNumber, callback) {
            //TODO currently relying on student name to serve as student Id. Needs to be revisited
            var studentIdentity = $resource("/students/projection/id/:id");
            var studentInfo = studentIdentity.query({ id: rollNumber }, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };

        this.updateStudentCoreDetails = function (rollNumber, studentRecord, callback) {
            var studentIdentity = $resource("/students/:id", null, {
                'update': { method: 'PUT' }
            });

            var studentInfo = studentIdentity.update({ id: rollNumber }, studentRecord, function (response) {
                if(callback){callback(null, response);}
            }, function (error) {
                callback(error, null);
            });
        };

        this.updateStudentSectionItem = function (rollNumber, sectionName, indexIncaseOfArray, detailsToUpdate, callback) {
            var updateOp = {
                'update': { method: 'PUT' }
            };

            var studentIdentity = (indexIncaseOfArray >= 0) ? $resource("/students/:id/sections/:sectionName/:indexIncaseOfArray", null, updateOp) : $resource("/students/:id/sections/:sectionName", null, updateOp);

            var studentRecord = {};
            studentRecord[sectionName] = detailsToUpdate;

            var params = { id: rollNumber}; 
            params.sectionName = sectionName;
            if (indexIncaseOfArray >= 0) {
                params.indexIncaseOfArray = indexIncaseOfArray;
            }

            var studentInfo = studentIdentity.update(params, studentRecord, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };

        this.addStudentSectionItem = function (rollNumber, sectionName, detailsToUpdate, callback) {
            var op = {
                'addStudentSectionItem': { method: 'POST' }
            };

            var studentIdentity = $resource("/students/:id/sections/:sectionName", null, op);

            var criteria = { id: rollNumber, sectionName: sectionName}; 

            var studentInfo = studentIdentity.addStudentSectionItem(criteria, detailsToUpdate, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };

        this.deleteSectionItem = function (rollNumber, sectionName, itemIndex, callback) {
            var op = {
                'deleteSectionItem': { method: 'DELETE' }
            };

            var studentIdentity = $resource("/students/:id/sections/:sectionName/:itemIndex", null, op);

            var criteria = { id: rollNumber, sectionName: sectionName,itemIndex:itemIndex}; 

            var studentInfo = studentIdentity.deleteSectionItem(criteria, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };


        this.getStudentById = function (studentId, callback) {
            var studentIdentity = $resource("/students/:studentId");
            var studentInfo = studentIdentity.get({ studentId: studentId }, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        };

        this.sendConfCodeToEmail = function (email, code, callback) {
            var responsePromise = $http({
                method: 'POST',
                data: JSON.stringify({ email: email, code: code }),
                headers: { 'Content-Type': 'application/json' },
                url: '/students/verify/email/code'
            });

            responsePromise.then(function (responseData) {
                callback(null, responseData.data);
            }, function (error) {
                callback(error, null);
            });
        };

        this.sendOTPtoMobile = function (mobileNumber, code, callback) {
            var responsePromise = $http({
                method: 'POST',
                data: JSON.stringify({ mobileNumber: mobileNumber, code: code }),
                headers: { 'Content-Type': 'application/json' },
                url: '/students/verify/mobile/otp'
            });

            responsePromise.then(function (responseData) {
                callback(null, responseData.data);
            }, function (error) {
                callback(error, null);
            });
        };

        this.getDistinctValuesFromStudents = function (keyName, query, callback) {
            var responsePromise = $http({
                method: 'POST',
                data: JSON.stringify({ keyName: keyName, query: query }),
                headers: { 'Content-Type': 'application/json' },
                url: '/students/distinct/fields'
            });

            responsePromise.then(function (responseData) {
                callback(null, responseData.data);
            }, function (error) {
                callback(error, null);
            });
        };

    }

    App.service('gridfsService', gridfsService);
    gridfsService.$inject = ['$resource', '$http'];

    function gridfsService($resource, $http) {
        this.removeDirtyAttachmentsForStudent = function (files, callback) {
            var responsePromise = $http({
                method: 'POST',
                data: JSON.stringify({ files: files }),
                headers: { 'Content-Type': 'application/json' },
                url: '/students/dirty/attachments'
            });

            responsePromise.then(function (responseData) {
                callback(null, responseData.data);
            }, function (error) {
                callback(error, null);
            });
        };
    }

    App.service('lookupService', lookupService);
    lookupService.$inject = ['$resource', '$http'];

    /**
     * Lookup service for all drop downs
     *  
     * @param {*} resource 
     */
    function lookupService($resource, $http) {

        this.loadDataFields = function (keyName, callback) {
            var lookupIdentity = $resource("/lookups/load/:keyName");
            var lookupInfo = lookupIdentity.query({ keyName: keyName }, function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        }

        this.addNewItemsIntoLookup = function (keyName, newValues, callback) {
            var lookupResource = $resource("/lookups/:keyName", null, {
                'addValue': { method: 'PUT' }
            });

            var lookupInfo = lookupResource.addValue({ keyName: keyName }, {values: newValues}, function (response) {
                
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        }

        
        this.loadValidationRulesForAllForms = function (callback) {
            var lookupIdentity = $resource("/lookups/validation/rules/messages");
            var lookupInfo = lookupIdentity.get(function (response) {
                callback(null, response);
            }, function (error) {
                callback(error, null);
            });
        }      

    }

})();