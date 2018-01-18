
(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('DebarController', DebarController);
    DebarController.$inject = ['$scope', '$rootScope', '$state', '$stateParams'];

    //studentService

    function DebarController($scope, $rootScope, $state, $stateParams) {
        // admissionsService.getAllStudents(function(err, response){
        // if(!err){
        //     $scope.studentsList= response;
        // } 
        // else{
            console.log('No DEbar Problem')
    //     }
    //    });
     }



    
})();