(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('clubsProfileView', clubsProfileView);
    clubsProfileView.$inject = ['$rootScope', '$compile'];
    function clubsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/clubs_profile.html',
            controller: 'ClubsProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('ClubsProfileViewController', ClubsProfileViewController);
    ClubsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function ClubsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        
        $scope.isArray = true;

        $scope.holdersForDropzone = [{name: "clubAppointmentLetter", maxFiles: 1}]
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

        $scope.$watch("recordToUpdate.clubs.clubStartDate", function () {
            if (($scope.recordToUpdate.clubs) && ($scope.recordToUpdate.clubs.clubStartDate)) {
                $('#clubEndDate').datepicker('setStartDate', $scope.recordToUpdate.clubs.clubStartDate);
            }
        });

        $scope.$watch("recordToUpdate.clubs.clubEndDate", function () {
            if (($scope.recordToUpdate.clubs) && ($scope.recordToUpdate.clubs.clubEndDate)) {
                $('#clubStartDate').datepicker('setEndDate', $scope.recordToUpdate.clubs.clubEndDate);
            }
        });

    }

})();