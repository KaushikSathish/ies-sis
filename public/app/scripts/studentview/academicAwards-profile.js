(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('academicAwardsProfileView', academicAwardsProfileView);
    academicAwardsProfileView.$inject = ['$rootScope', '$compile'];
    function academicAwardsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/academicAwards_profile.html',
            controller: 'AcademicaAwardsProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('AcademicaAwardsProfileViewController', AcademicaAwardsProfileViewController);
    AcademicaAwardsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function AcademicaAwardsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;

        $scope.holdersForDropzone = [{name: "awardCertificate", maxFiles: 1}]
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

    }

})();