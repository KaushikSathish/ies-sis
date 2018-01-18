(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('digitalIdentityProfileView', digitalIdentityProfileView);
    digitalIdentityProfileView.$inject = ['$rootScope', '$compile'];
    function digitalIdentityProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'app/modules/student-profile/digitalIdentity_profile.html',
            controller: 'DigitalIdentityProfileViewController',
            replace: true
        };
    }

    App.controller('DigitalIdentityProfileViewController', DigitalIdentityProfileViewController);
    DigitalIdentityProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', '$window'];
    function DigitalIdentityProfileViewController($scope, $rootScope, $state, $stateParams, $localStorage, $window) {  
                
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }
      
    }

})();