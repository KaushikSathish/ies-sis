(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('associationsProfileView', associationsProfileView);
    associationsProfileView.$inject = ['$rootScope', '$compile'];
    function associationsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'app/modules/student-profile/associations_profile.html',
            controller: 'associationsProfileViewController',
            replace: true
        };
    }

    App.controller('associationsProfileViewController', associationsProfileViewController);
    associationsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function associationsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {        
        $scope.isArray = true;

        $scope.holdersForDropzone = [{name: "associationAppointmentLetter", maxFiles: 1}]
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

        $scope.$watch("recordToUpdate.associations.associationStartDate", function () {
            if (($scope.recordToUpdate.associations) && ($scope.recordToUpdate.associations.associationStartDate)) {
                $('#associationEndDate').datepicker('setStartDate', $scope.recordToUpdate.associations.associationStartDate);
            }
        });

        $scope.$watch("recordToUpdate.associations.associationEndDate", function () {
            if (($scope.recordToUpdate.associations) && ($scope.recordToUpdate.associations.associationEndDate)) {
                $('#associationStartDate').datepicker('setEndDate', $scope.recordToUpdate.associations.associationEndDate);
            }
        });

    }

})();