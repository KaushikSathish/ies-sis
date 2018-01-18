(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('languageProfileView', languageProfileView);
    languageProfileView.$inject = ['$rootScope', '$compile'];
    function languageProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'app/modules/student-profile/language_profile.html',
            controller: 'LanguageProfileViewController',
            replace: true
        };
    }

    App.controller('LanguageProfileViewController', LanguageProfileViewController);
    LanguageProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', '$window'];
    function LanguageProfileViewController($scope, $rootScope, $state, $stateParams, $localStorage, $window) {  
                
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }
      
    }

})();