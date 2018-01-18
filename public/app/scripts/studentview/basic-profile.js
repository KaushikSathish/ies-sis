(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('basicProfileView', basicProfileView);
    basicProfileView.$inject = ['$rootScope', '$compile'];
    function basicProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/basic_profile.html',
            controller: 'BasicProfileViewController',
            replace: true,
            scope: true,
            link: function (scope, element) {
            }

        };
    }

    App.controller('BasicProfileViewController', BasicProfileViewController);
    BasicProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window', '$filter'];
    function BasicProfileViewController($scope, $rootScope, $state, $stateParams, studentService, $localStorage, $window, $filter) {
        $scope.holdersForNewSelectItem = ["motherTongues"];
        if (($scope.recordToUpdate.basic) && (!$scope.recordToUpdate.basic.isMarried)) {
            //default values
            $scope.recordToUpdate.basic.isMarried = false;
        }

        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }

        $scope.preSave = function() {
            if ($scope.recordToUpdate.basic.firstName) {
                $scope.recordToUpdate.basic.firstName = $scope.recordToUpdate.basic.firstName.toUpperCase();    
            } 
            if ($scope.recordToUpdate.basic.middleName) {
                $scope.recordToUpdate.basic.middleName = $scope.recordToUpdate.basic.middleName.toUpperCase();    
            } 
            if ($scope.recordToUpdate.basic.lastName) {
                $scope.recordToUpdate.basic.lastName = $scope.recordToUpdate.basic.lastName.toUpperCase();    
            } 
            if ($scope.recordToUpdate.basic.hostelBlockName) {
                $scope.recordToUpdate.basic.hostelBlockName = $scope.recordToUpdate.basic.hostelBlockName.toUpperCase();
            }
        };

        $scope.$watch("recordToUpdate.basic.nationality", function (newValue, oldValue) {
            if (($scope.recordToUpdate.basic) && ($scope.recordToUpdate.basic.nationality)) {
                if (newValue != $scope.studentRecord.basic.nationality) {
                    $scope.resetStateElement();
                }
            }
        });
        $scope.resetStateElement = function () {
            $scope.recordToUpdate.basic.state = '';
        }

        $scope.$watch("recordToUpdate.basic.dobStr", function () {
            if ($scope.recordToUpdate.basic) {
                $scope.ageCalculation($scope.recordToUpdate.basic);
            }
        });

        $scope.ageCalculation = function (studentRecord) {
            if ($scope.recordToUpdate.basic.dobStr) {
                var dob = $scope.recordToUpdate.basic.dobStr;
                var dobMoment = moment(dob, "DD/MMM/YYYY");
                $scope.recordToUpdate.basic.age = moment().diff(dobMoment, "years");
            } else {
                $scope.recordToUpdate.basic.age = undefined;
            }
        };
    }

})();