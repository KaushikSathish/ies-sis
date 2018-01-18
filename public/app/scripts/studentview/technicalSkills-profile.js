(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('technicalSkillsProfileView', technicalSkillsProfileView);
    technicalSkillsProfileView.$inject = ['$rootScope', '$compile'];
    function technicalSkillsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/technicalSkills_profile.html',
            controller: 'TechnicalSkillsProfileViewController',
            scope: true,
            replace: true
        };
    }

    App.controller('TechnicalSkillsProfileViewController', TechnicalSkillsProfileViewController);
    TechnicalSkillsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService'];
    function TechnicalSkillsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.holdersForNewSelectItem = ["technicalSkills"];
        $scope.isSingleArray = true;        
        $scope.setEnvironmentSaveSectionItem = function (sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }
    }

})();