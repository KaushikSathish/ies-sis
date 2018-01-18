(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('contactProfileView', contactProfileView);
    contactProfileView.$inject = ['$rootScope', '$compile'];
    function contactProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/contact_profile.html',
            controller: 'ContactProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('ContactProfileViewController', ContactProfileViewController);
    ContactProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function ContactProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.holdersForNewSelectItem = ["cities"];
        $scope.setEnvironmentSaveSectionItem = function(sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId);
        }

        $scope.preSave = function preSave() {
            if ($scope.recordToUpdate.contact.sameAddress) {
                $scope.recordToUpdate.contact.commAddressLine1 = $scope.recordToUpdate.contact.addressLine1;
                $scope.recordToUpdate.contact.commAddressLine2 = $scope.recordToUpdate.contact.addressLine2;
                $scope.recordToUpdate.contact.commCity = $scope.recordToUpdate.contact.city;
                $scope.recordToUpdate.contact.commState = $scope.recordToUpdate.contact.state;
                $scope.recordToUpdate.contact.commPincode = $scope.recordToUpdate.contact.pincode;
                $scope.recordToUpdate.contact.commCountry = $scope.recordToUpdate.contact.country;
            }
        };

        $scope.$watch("recordToUpdate.contact.sameAddress", function(newValue, oldValue) {
            if (newValue) {
                $scope.recordToUpdate.contact.commAddressLine1 = "";
                $scope.recordToUpdate.contact.commAddressLine2 = "";
                $scope.recordToUpdate.contact.commCity = "";
                $scope.recordToUpdate.contact.commState = "";
                $scope.recordToUpdate.contact.commPincode = "";
                $scope.recordToUpdate.contact.commCountry = "";                
            }
        });
    }

})();