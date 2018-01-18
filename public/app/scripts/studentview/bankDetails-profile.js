(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('bankDetailsProfileView', bankDetailsProfileView);
    bankDetailsProfileView.$inject = ['$rootScope', '$compile'];
    function bankDetailsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/bankDetails_profile.html',
            controller: 'BankDetailsProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('BankDetailsProfileViewController', BankDetailsProfileViewController);
    BankDetailsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function BankDetailsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.bankAccType=["Savings","Current"];
        // $scope.holdersForDropzone = [{name: "bankPassBook", maxFiles: 1}]
        // $scope.attachmentField = null;
        
        
        // $scope.captureFieldName = function (fieldName) {
        //     $scope.attachmentField = fieldName;
        // };
        
        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        // $scope.setEnvironmentRemoveAttachment = function(file, fieldName) {
        //     $scope.removeAttachment.call($scope, file, fieldName);
        // };

        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId)
        }

    }

})();