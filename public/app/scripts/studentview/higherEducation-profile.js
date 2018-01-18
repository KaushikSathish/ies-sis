(function () {
    'use strict';
    var App = angular.module('app');

    App.directive('higherEducationProfileView', higherEducationProfileView);
    higherEducationProfileView.$inject = ['$rootScope', '$compile'];
    function higherEducationProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/higherEducation_profile.html',
            controller: 'HigherEducationProfileViewController',
            scope: true,
            replace: true
        };
    }

    App.controller('HigherEducationProfileViewController', HigherEducationProfileViewController);
    HigherEducationProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService'];
    function HigherEducationProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.holdersForNewSelectItem = ["cities"];
    
        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
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