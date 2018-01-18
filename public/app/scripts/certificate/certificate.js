(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('CertificateController', CertificateController);
    CertificateController.$inject = ['$scope', '$rootScope', '$state', '$stateParams'];

    //studentService

    function CertificateController($scope, $rootScope, $state, $stateParams) {
        // admissionsService.getAllStudents(function(err, response){
        // if(!err){
        //     $scope.studentsList= response;
        // } 
        // else{
            console.log('No CertificateController Problem')
    //     }
    //    });
     }



    
})();