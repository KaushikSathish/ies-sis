(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('eventsProfileView', eventsProfileView);
    eventsProfileView.$inject = ['$rootScope', '$compile'];
    function eventsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/events_profile.html',
            controller: 'EventsProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('EventsProfileViewController', EventsProfileViewController);
    EventsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function EventsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.eventCurriculum = ["Extra-Curicular","Co-Curicular"];
        $scope.holdersForNewSelectItem = ["coCurriculumCategory", "extraCurriculumCategory"];

        // $scope.coCurriculumCategory = ["Conference","Symposium","Technical Fest","WorkShops","Paper Presentation","Olympiad"];
        // $scope.extraCurriculumCategory = ["Cultural Fest","Sports","Hostel Day","NSS","NCC"];
        $scope.isArray = true;
      
        $scope.holdersForDropzone = [{name: "eventCertificate", maxFiles: 1}]
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

        $scope.$watch("recordToUpdate.events.eventStartDate", function () {
            if (($scope.recordToUpdate.events) && ($scope.recordToUpdate.events.eventStartDate)) {
                $('#eventEndDate').datepicker('setStartDate', $scope.recordToUpdate.events.eventStartDate);
            }
        });

        $scope.$watch("recordToUpdate.events.eventEndDate", function () {
            if (($scope.recordToUpdate.events) && ($scope.recordToUpdate.events.eventEndDate)) {
                $('#eventStartDate').datepicker('setEndDate', $scope.recordToUpdate.events.eventEndDate);
            }
        });

    }

})();