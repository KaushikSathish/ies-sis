(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('valueAdditionProfileView', valueAdditionProfileView);
    valueAdditionProfileView.$inject = ['$rootScope', '$compile'];
    function valueAdditionProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/valueAddition_profile.html',
            controller: 'ValueAdditionProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('ValueAdditionProfileViewController', ValueAdditionProfileViewController);
    ValueAdditionProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function ValueAdditionProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.holdersForDropzone = [{name: "valueAdditionCert", maxFiles: 1}]
        $scope.attachmentField = null;
        
        
        $scope.captureFieldName = function (fieldName) {
            $scope.attachmentField = fieldName;
        };
        
        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        $scope.setEnvironmentRemoveAttachment = function(file, fieldName) {
            $scope.removeAttachment.call($scope, file, fieldName);
        };

        $scope.setEnvironmentDeleteOnConfirmation = function(sectionName, itemIndex) {
            $scope.deleteOnConfirmation.call($scope, sectionName, itemIndex);
        };

        $scope.setEnvironmentAddSectionItem = function(sectionName) {
            $scope.addSectionItem.call($scope, sectionName);
        };

        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId)
        }

        $scope.$watch("recordToUpdate.valueAddition.valueAdditionCourseStartDate", function () {
            if (($scope.recordToUpdate.valueAddition) && ($scope.recordToUpdate.valueAddition.valueAdditionCourseStartDate)) {
                $('#valueAdditionCourseEndDate').datepicker('setStartDate', $scope.recordToUpdate.valueAddition.valueAdditionCourseStartDate);
            }
        });

        $scope.$watch("recordToUpdate.valueAddition.valueAdditionCourseEndDate", function () {
            if (($scope.recordToUpdate.valueAddition) && ($scope.recordToUpdate.valueAddition.valueAdditionCourseEndDate)) {
                $('#valueAdditionCourseStartDate').datepicker('setEndDate', $scope.recordToUpdate.valueAddition.valueAdditionCourseEndDate);
            }
        });

    }

})();