(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('internshipProfileView', internshipProfileView);
    internshipProfileView.$inject = ['$rootScope', '$compile'];
    function internshipProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/internship_profile.html',
            controller: 'InternshipProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('InternshipProfileViewController', InternshipProfileViewController);
    InternshipProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function InternshipProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {        
        $scope.internTypes = ["Full time", "Part time", "In-plant Training"];
        $scope.holdersForDropzone = [{name: "internOfferLetter", maxFiles: 1} , {name: "internCompletion", maxFiles: 1}]
        $scope.isArray = true;        
        $scope.attachmentField = null;
        $scope.holdersForNewSelectItem = ["cities"];

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

        $scope.$watch("recordToUpdate.internship.internStartDate", function () {
            if (($scope.recordToUpdate.internship) && ($scope.recordToUpdate.internship.internStartDate)) {
                $('#internEndDate').datepicker('setStartDate', $scope.recordToUpdate.internship.internStartDate);
            }
        });

        $scope.$watch("recordToUpdate.internship.internEndDate", function () {
            if (($scope.recordToUpdate.internship) && ($scope.recordToUpdate.internship.internEndDate)) {
                $('#internStartDate').datepicker('setEndDate', $scope.recordToUpdate.internship.internEndDate);
            }
        });

    }

})();