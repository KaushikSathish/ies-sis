(function () {
    'use strict';
    var App = angular.module('app');
    App.directive('publicationsProfileView', publicationsProfileView);
    publicationsProfileView.$inject = ['$rootScope', '$compile'];
    function publicationsProfileView($rootScope, $compile) {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/student-profile/publications_profile.html',
            controller: 'PublicationsProfileViewController',
            replace: true,
            scope: true
        };
    }

    App.controller('PublicationsProfileViewController', PublicationsProfileViewController);
    PublicationsProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'studentService', '$localStorage', '$window'];
    function PublicationsProfileViewController($scope, $rootScope, $state, $stateParams, studentService) {
        $scope.isArray = true;
        $scope.publishedSources = [
            "Citation Journals", "Other Journals", "Conference","Books"
        ];
        $scope.holdersForDropzone = [{ name: "paperPublished", maxFiles: 1 }]
        $scope.attachmentField = null;
        $scope.numAuthors = ["1", "2", "3"];
        $scope.holders = ["publicationAuthors"];

        $scope.captureFieldName = function (fieldName) {
            $scope.attachmentField = fieldName;
        };

        $scope.setEnvironmentForEditItem = function (sectionName, editable, index, formId) {
            $scope.edit.call($scope, sectionName, editable, index, formId);
        };

        $scope.setEnvironmentRemoveAttachment = function (file, fieldName) {
            $scope.removeAttachment.call($scope, file, fieldName);
        };

        $scope.setEnvironmentDeleteOnConfirmation = function (sectionName, itemIndex) {
            $scope.deleteOnConfirmation.call($scope, sectionName, itemIndex);
        };

        $scope.setEnvironmentAddSectionItem = function (sectionName) {
            $scope.addSectionItem.call($scope, sectionName);
        };

        $scope.setEnvironmentSaveSectionItem = function (sectionName, formId) {
            $scope.saveSectionItem.call($scope, sectionName, formId)
        };

        $scope.$watch("recordToUpdate.publications.numAuthors", function () {
            if(!$scope.recordToUpdate.publications) {
                return;
            }
            var numAuthors = Number($scope.recordToUpdate.publications.numAuthors);            
            if (!isNaN(numAuthors) && ($scope.recordToUpdate.publications.publicationAuthors)) {
                var author;
                if(numAuthors < $scope.recordToUpdate.publications.publicationAuthors.length) {
                    var diff = $scope.recordToUpdate.publications.publicationAuthors.length - numAuthors;
                    while(diff) {
                        $scope.recordToUpdate.publications.publicationAuthors.splice(-1,1);
                        diff--;
                    }
                }
                else {
                    for (var i = 0; i < numAuthors; i++) {
                        author = $scope.recordToUpdate.publications.publicationAuthors[i]
                        if (!author) {
                            $scope.recordToUpdate.publications.publicationAuthors.push({});
                        }
                    }
                }                
            }
        });


    }

})();