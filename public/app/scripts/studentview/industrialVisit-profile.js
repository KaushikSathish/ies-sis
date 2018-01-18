(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('industrialVisitProfileView', industrialVisitProfileView);
    industrialVisitProfileView.$inject = ['$rootScope', '$compile'];
    function industrialVisitProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/industrialVisit_profile.html',
            controller: 'IndustrialVisitProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('IndustrialVisitProfileViewController', IndustrialVisitProfileViewController);
    IndustrialVisitProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function IndustrialVisitProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true; 
        
        $scope.holdersForDropzone = [{name: "industrialVisitPermission", maxFiles: 1}]
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
    }

})();