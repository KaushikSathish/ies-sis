(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('itSkillsProfileView', itSkillsProfileView);
    itSkillsProfileView.$inject = ['$rootScope', '$compile'];
    function itSkillsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/itSkills_profile.html',
            controller: 'ItSkillsProfileViewController',
            scope: true,
            replace: true
        };
    }

    App.controller('ItSkillsProfileViewController', ItSkillsProfileViewController);
    ItSkillsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService'];
    function ItSkillsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.holders = ["itSkillsLanguages", "itSkillsOs", "itSkillsTechnologies", "itSkillsTools"];
        $scope.holdersForNewSelectItem = ["itSkillsLanguages", "itSkillsOs", "itSkillsTechnologies", "itSkillsTools"];
        $scope.setEnvironmentForEditItem = function (sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }
    }

})();