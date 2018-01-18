(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('ConvocationController', ConvocationController);
    ConvocationController.$inject = ['$scope', '$rootScope', '$state', '$stateParams'];

    //studentService

    function ConvocationController($scope, $rootScope, $state, $stateParams) {
        // admissionsService.getAllStudents(function(err, response){
        // if(!err){
        //     $scope.studentsList= response;
        // } 
        // else{
            console.log('No ConvocationController Problem')
    //     }
    //    });
     }



    
})();