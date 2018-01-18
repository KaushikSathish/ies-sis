(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('entrepreneurshipProfileView', entrepreneurshipProfileView);
    entrepreneurshipProfileView.$inject = ['$rootScope', '$compile'];
    function entrepreneurshipProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/entrepreneurship_profile.html',
            controller: 'EntrepreneurshipProfileViewController',
            replace: true
        };
    }

    App.controller('EntrepreneurshipProfileViewController', EntrepreneurshipProfileViewController);
    EntrepreneurshipProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function EntrepreneurshipProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
       
        $scope.holdersForNewSelectItem = ["cities"];

        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };
                
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }

    }

})();