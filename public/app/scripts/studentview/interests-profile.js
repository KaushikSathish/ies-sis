(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('interestsProfileView', interestsProfileView);
    interestsProfileView.$inject = ['$rootScope', '$compile'];
    function interestsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/interests_profile.html',
            controller: 'InterestsProfileViewController',
            scope: true,
            replace: true
        };
    }

    App.controller('InterestsProfileViewController', InterestsProfileViewController);
    InterestsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService'];
    function InterestsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.holdersForNewSelectItem = ["interests"];
        $scope.isSingleArray = true;        
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }
    }

})();