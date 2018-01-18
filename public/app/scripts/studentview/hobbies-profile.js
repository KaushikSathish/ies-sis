(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('hobbiesProfileView', hobbiesProfileView);
    hobbiesProfileView.$inject = ['$rootScope', '$compile'];
    function hobbiesProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/hobbies_profile.html',
            controller: 'HobbiesProfileViewController',
            scope: true,
            replace: true
        };
    }

    App.controller('HobbiesProfileViewController', HobbiesProfileViewController);
    HobbiesProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService'];
    function HobbiesProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.holdersForNewSelectItem = ["hobbies"];
        $scope.isSingleArray = true;
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }
    }

})();