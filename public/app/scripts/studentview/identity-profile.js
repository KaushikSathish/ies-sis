(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('identityProfileView', identityProfileView);
    identityProfileView.$inject = ['$rootScope', '$compile'];
    function identityProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/identity_profile.html',
            controller: 'IdentityProfileViewController',
            replace: true
        };
    }

    App.controller('IdentityProfileViewController', IdentityProfileViewController);
    IdentityProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function IdentityProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.bloodGroups = ["A Positive", "A Negative", "B Positive", "B Negative", "AB Positive", "AB Negative", "O Positive", "O Negative"];
        $scope.residentStatuses = ["Indian", "NRI", "Foreigner"];

        $scope.setEnvironmentForEditItem = function(sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };
                
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }

    }

})();