(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('familyProfileView', familyProfileView);
    familyProfileView.$inject = ['$rootScope', '$compile'];
    function familyProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/family_profile.html',
            controller: 'FamilyProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('FamilyProfileViewController', FamilyProfileViewController);
    FamilyProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', '$window', 'studentService', 'lookupService'];
    function FamilyProfileViewController($scope, $rootScope, $state, $stateParams, $localStorage, $window, studentService, lookupService) {
        loadLookups();
        
        $scope.holdersForDropzone = [{name: "fatherIncomeCert", maxFiles: 1}, {name: "motherIncomeCert", maxFiles: 1}]
        $scope.attachmentField = null;
        
        // parentEducationQualifications
        $scope.getOccupations = function getOccupations(term, callback) {
            filterLookupsByTerm("occupations", term, callback);
        };

        $scope.captureFieldName = function (fieldName) {
            $scope.attachmentField = fieldName;
        };    

        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }

        $scope.setEnvironmentRemoveAttachment = function(file, fieldName) {
            $scope.removeAttachment.call($scope, file, fieldName);
        };


        $scope.preSave = function() {
            if ($scope.recordToUpdate.family.fatherName) {
                $scope.recordToUpdate.family.fatherName = $scope.recordToUpdate.family.fatherName.toUpperCase();    
            } 
            if ($scope.recordToUpdate.family.motherName) {
                $scope.recordToUpdate.family.motherName = $scope.recordToUpdate.family.motherName.toUpperCase();    
            } 
            if ($scope.recordToUpdate.family.guardianName) {
                $scope.recordToUpdate.family.guardianName = $scope.recordToUpdate.family.guardianName.toUpperCase();    
            } 
            if ($scope.recordToUpdate.family.fatherEmailId) {
                $scope.recordToUpdate.family.fatherEmailId = $scope.recordToUpdate.family.fatherEmailId.toLowerCase();
            }
            if ($scope.recordToUpdate.family.motherEmailId) {
                $scope.recordToUpdate.family.motherEmailId = $scope.recordToUpdate.family.motherEmailId.toLowerCase();
            }
        };

        function loadLookups() {
            var lookupFields = ["parentEducationQualifications", "occupations"];
            lookupFields.forEach(function (fieldName) {
                lookupService.loadDataFields(fieldName, function (err, res) {
                    res.sort(function (a, b) {
                        if (a < b) return -1;
                        else if (a > b) return 1;
                        return 0;
                    });
                    $scope[fieldName] = res;
                });
            });
        }

        function filterLookupsByTerm(lookupKey, term, callback) {
            lookupService.loadDataFields(lookupKey, function(err, values) {
                if (err) {
                    return;
                }

                var suggestions = [];
                for (var i = 0; i < values.length; i++) {
                    if (values[i].toLowerCase().indexOf(term) != -1) {
                        suggestions.push(values[i]);
                    }
                }
                callback(null, suggestions);
            });
        };
    }

})();