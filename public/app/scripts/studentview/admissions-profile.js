(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('admissionsProfileView', admissionsProfileView);
    admissionsProfileView.$inject = ['$rootScope', '$compile'];
    function admissionsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/admissions_profile.html',
            controller: 'AdmissionsProfileViewController',
            replace: true
        };
    }

    App.controller('AdmissionsProfileViewController', AdmissionsProfileViewController);
    AdmissionsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function AdmissionsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.admittedModes = ["Counselling", "Management", "Lateral"];
        $scope.streams = ["Academic", "Vocational"];
        $scope.quotas = ["Ex-Service Men", "Sports", "Other States", "N/A"];
        loadLookups();

        function loadLookups() {
            studentService.getDistinctValuesFromStudents("programName", {}, function (err, result) {
                if (!err) {
                    $scope.programs = [];
                    result.sort(function (a, b) {
                        if (a < b) return -1;
                        else if (a > b) return 1;
                        return 0;
                    });               
                    $scope.programs = result;                    
                }
            });
            studentService.getDistinctValuesFromStudents("branchName", {}, function (err, result) {
                if (!err) {
                    $scope.branches = [];
                    result.sort(function (a, b) {
                        if (a < b) return -1;
                        else if (a > b) return 1;
                        return 0;
                    });               
                    $scope.branches = result;                    
                }
            });
        }
        
    }

})();