(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('TCController', TCController);
    TCController.$inject = ['$scope', '$rootScope', '$state', '$stateParams'];

    //studentService

    function TCController($scope, $rootScope, $state, $stateParams) {
        // admissionsService.getAllStudents(function(err, response){
        // if(!err){
        //     $scope.studentsList= response;
        // } 
        // else{
            console.log('No TC Problem')
    //     }
    //    });
     }



    
})();