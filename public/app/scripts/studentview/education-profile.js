(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('educationProfileView', educationProfileView);
    educationProfileView.$inject = ['$rootScope', '$compile'];
    function educationProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/education_profile.html',
            controller: 'EducationProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('EducationProfileViewController', EducationProfileViewController);
    EducationProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService'];
    function EducationProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.holdersForNewSelectItem = ["cities"];
        $scope.holdersForDropzone = [{name: "markSheet", maxFiles: 1}, {name: "degreeCertificate", maxFiles: 1}]
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

        $scope.preSave = function() {
            var education = $scope.recordToUpdate.education;
            education.studentPercentage=(education.studentMarks/education.maxMarks)*100;
            if(!education.studentPercentage){
                education.studentPercentage= "";
            }
        };

    }

})();