(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('projectsProfileView', projectsProfileView);
    projectsProfileView.$inject = ['$rootScope', '$compile'];
    function projectsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/projects_profile.html',
            controller: 'ProjectsProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('ProjectsProfileViewController', ProjectsProfileViewController);
    ProjectsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function ProjectsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.projectTypes = ["Mini Project", "Sponsored/Research Project", "Final year Project", "Others"];
        $scope.isArray = true;
        $scope.holdersForNewSelectItem = ["cities"];
        $scope.locationTypes = ["College", "External/ Industry"];
        $scope.holdersForDropzone = [{name: "projectCompletionCert", maxFiles: 1}]
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

        $scope.$watch("recordToUpdate.projects.projectStartDate", function () {
            if (($scope.recordToUpdate.projects) && ($scope.recordToUpdate.projects.projectStartDate)) {
                $('#projectEndDate').datepicker('setStartDate', $scope.recordToUpdate.projects.projectStartDate);
            }
        });

        $scope.$watch("recordToUpdate.projects.projectEndDate", function () {
            if (($scope.recordToUpdate.projects) && ($scope.recordToUpdate.projects.projectEndDate)) {
                $('#projectStartDate').datepicker('setEndDate', $scope.recordToUpdate.projects.projectEndDate);
            }
        });

    }

})();