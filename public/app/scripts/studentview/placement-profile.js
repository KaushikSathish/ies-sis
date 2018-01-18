(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('placementProfileView', placementProfileView);
    placementProfileView.$inject = ['$rootScope', '$compile'];
    function placementProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/placement_profile.html',
            controller: 'PlacementProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('PlacementProfileViewController', PlacementProfileViewController);
    PlacementProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function PlacementProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.holdersForNewSelectItem = ["cities"];
        $scope.holdersForDropzone = [{name: "placementOfferLetter", maxFiles: 1}]
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

        $scope.$watch("recordToUpdate.placement.placementDatePlaced", function () {
            if (($scope.recordToUpdate.placement) && ($scope.recordToUpdate.placement.placementDatePlaced)) {
                $('#placementDateOfJoining').datepicker('setStartDate', $scope.recordToUpdate.placement.placementDatePlaced);
            }
        });

        $scope.$watch("recordToUpdate.placement.placementDateOfJoining", function () {
            if (($scope.recordToUpdate.placement) && ($scope.recordToUpdate.placement.placementDateOfJoining)) {
                $('#placementDatePlaced').datepicker('setEndDate', $scope.recordToUpdate.placement.placementDateOfJoining);
            }
        });


    }

})();