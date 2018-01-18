(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('experienceProfileView', experienceProfileView);
    experienceProfileView.$inject = ['$rootScope', '$compile'];
    function experienceProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/experience_profile.html',
            controller: 'ExperienceProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('ExperienceProfileViewController', ExperienceProfileViewController);
    ExperienceProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function ExperienceProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.holdersForNewSelectItem = ["cities"];
        $scope.holdersForDropzone = [{ name: "workExperienceOfferLetter", maxFiles: 1 }, { name: "workExperienceCompletion", maxFiles: 1 }]

        $scope.attachmentField = null;

        $scope.captureFieldName = function (fieldName) {
            $scope.attachmentField = fieldName;
        };

        $scope.setEnvironmentForEditItem = function (sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        $scope.setEnvironmentRemoveAttachment = function (file, fieldName) {
            $scope.removeAttachment.call($scope, file, fieldName);
        };

        $scope.setEnvironmentDeleteOnConfirmation = function (sectionName, itemIndex) {
            $scope.deleteOnConfirmation.call($scope, sectionName, itemIndex);
        };

        $scope.setEnvironmentAddSectionItem = function (sectionName) {
            $scope.addSectionItem.call($scope, sectionName);
        };

        $scope.setEnvironmentSaveSectionItem = function (sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId)
        }

        $scope.preSave = function () {
            var experience = $scope.recordToUpdate.workExperience;
            var endDate = experience.workEndDate;
            var endDateMoment = moment(endDate, "DD/MMM/YYYY");
            var startdate = experience.workStartDate;
            var startDateMoment = moment(startdate, "DD/MMM/YYYY");
            experience.experienceInMonths = endDateMoment.diff(startDateMoment, "months", true);
        };

        $scope.$watch("recordToUpdate.workExperience.workStartDate", function () {
            if (($scope.recordToUpdate.workExperience) && ($scope.recordToUpdate.workExperience.workStartDate)) {
                $('#workEndDate').datepicker('setStartDate', $scope.recordToUpdate.workExperience.workStartDate);
            }
        });

        $scope.$watch("recordToUpdate.workExperience.workEndDate", function () {
            if (($scope.recordToUpdate.workExperience) && ($scope.recordToUpdate.workExperience.workEndDate)) {
                $('#workStartDate').datepicker('setEndDate', $scope.recordToUpdate.workExperience.workEndDate);
            }
        });

    }

})();