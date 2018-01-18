(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('patentProfileView', patentProfileView);
    patentProfileView.$inject = ['$rootScope', '$compile'];
    function patentProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/patent_profile.html',
            controller: 'PatentProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('PatentProfileViewController', PatentProfileViewController);
    PatentProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function PatentProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.patentStatus = ["Issued", "Pending"];
        $scope.holdersForDropzone = [{name: "patentDocument", maxFiles: 1}]
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

        $scope.$watch("recordToUpdate.patent.filingDate", function () {
            if (($scope.recordToUpdate.patent) && ($scope.recordToUpdate.patent.filingDate)) {
                $('#issueDate').datepicker('setStartDate', $scope.recordToUpdate.patent.filingDate);
            }
        });

        $scope.$watch("recordToUpdate.patent.issueDate", function () {
            if (($scope.recordToUpdate.patent) && ($scope.recordToUpdate.patent.issueDate)) {
                $('#filingDate').datepicker('setEndDate', $scope.recordToUpdate.patent.issueDate);
            }
        });



    }

})();