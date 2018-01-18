(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('DashboardController', DashboardController);
    DashboardController.$inject = ['$scope', '$rootScope', '$state', '$stateParams'];

    function DashboardController($scope, $rootScope, $state, $stateParams) {
       $scope.prasanna = 'prasanna';
       console.log('porasa');
    }

})();