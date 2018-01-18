(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('compScoreProfileView', compScoreProfileView);
    compScoreProfileView.$inject = ['$rootScope', '$compile'];
    function compScoreProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/compScore_profile.html',
            controller: 'CompScoreProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('CompScoreProfileViewController', CompScoreProfileViewController);
    CompScoreProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function CompScoreProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true; 
        
        $scope.holdersForDropzone = [{name: "compExamCertificate", maxFiles: 1}]
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
            var compExam = $scope.recordToUpdate.compExam;
            compExam.studentPercentage=(compExam.compExamScore/compExam.maxMarks)*100;
            if(!compExam.studentPercentage){
                compExam.studentPercentage= "";
            }
        };
    }

})();