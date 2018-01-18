(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('StudentsController', StudentsController);
    StudentsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$filter', 'studentService'];

    function StudentsController($scope, $rootScope, $state, $stateParams, $filter, studentService) {
        if ($rootScope.Auth.principal.userRoles && $rootScope.Auth.principal.userRoles['STUDENT']) {
            $state.go('studentprofileview', { rollNumber: $rootScope.Auth.principal.preferred_username });
            return;
        }

        $scope.showLoader = false;
        $scope.searchParams = {};
        loadSearchLookups();

        function getDatasetForTable(studentsList) {
            var dataset = [], temparr = [];
            studentsList.forEach(function (student) {
                var record = {
                    rollNumber: student.rollNumber,
                    studentName: $filter('camelCase')(student.studentName),
                    programName: student.programName,
                    branchName: $filter('camelCase')(student.branchName)
                };
                dataset.push(record);
            });
            return dataset;
        }

        var initDataTableWithValues = function (dataset) {
            jQuery('.js-dataTable-full').DataTable({
                destroy: true,
                data: dataset,
                DOM: 'lfrtip',
                columns: [
                    {
                        data: "rollNumber",
                        "render": function (data, type, row, meta) {
                            if (type === 'display') {
                                data = '<a href="/#!/studentProfileView/' + data + '">' + data + '</a>'
                            }
                            return data;
                        }
                    },
                    { data: "studentName" },
                    { data: "programName" },
                    { data: "branchName" }
                ],
                pageLength: 50,
                lengthMenu: [[25, 50, 75, 100], [25, 50, 75, 100]]
            });
            $.fn.dataTable.ext.errMode = 'none';
        };

        $scope.getStudentsOnSearchParams = function () {
            //TODO if uncommented, datatable is becoming small and centered
            // $scope.showLoader = true;

            var searchQuery = {};
            if ($scope.searchParams.program) {
                searchQuery["programName"] = $scope.searchParams.program;
            }
            if ($scope.searchParams.departments && $scope.searchParams.departments.length) {
                searchQuery["branchName"] = { $in: $scope.searchParams.departments };
            }
            if ($scope.searchParams.currentSem) {
                searchQuery["currentSem"] = $scope.searchParams.currentSem;
            }
            if ($scope.searchParams.rollNumber) {
                searchQuery["rollNumber"] = new RegExp($scope.searchParams.rollNumber.toUpperCase());
            }
            if ($scope.searchParams.studentName) {
                searchQuery["studentName"] = new RegExp($scope.searchParams.studentName.toUpperCase());
            }

            studentService.queryStudents(searchQuery, function (err, response) {
                if (!err) {
                    $scope.showLoader = false;
                    initDataTableWithValues(getDatasetForTable(response));
                    if (response.length > 0) {
                        $(".tablesearch").removeClass("in");
                        $("#arrow_inSearch").removeClass("icon-chevron-down");
                        $("#arrow_inSearch").addClass("icon-chevron-right");
                    }
                }
            })
        }

        $scope.loadDepartmentsForSelectedProgram = function () {
            $scope.departments = [];
            $scope.searchParams.departments = '';
            $scope.departments = $scope.programs[$scope.searchParams.program];
        }

        function getDepartmentsMappedToProgram(programName) {
            var query = {};
            query["programName"] = programName;
            studentService.getDistinctValuesFromStudents("branchName", query, function (err, departments) {
                if (!err) {
                    departments.sort(function (a, b) {
                        if (a < b) return -1;
                        else if (a > b) return 1;
                        return 0;
                    });
                    $scope.programs[programName] = [];
                    $scope.programs[programName] = departments;                    
                }
            });
        };

        function loadSearchLookups() {
            studentService.getDistinctValuesFromStudents("programName", {}, function (err, result) {
                if (!err) {
                    $scope.programs = {};
                    result.sort(function (a, b) {
                        if (a < b) return -1;
                        else if (a > b) return 1;
                        return 0;
                    });
                    $scope.programsNames = result;
                    result.forEach(function (p) {
                        getDepartmentsMappedToProgram(p);
                    });
                }
            });
            studentService.getDistinctValuesFromStudents("currentSem", {}, function (err, result) {
                if (!err) {
                    result.sort(function (a, b) {
                        return a - b;
                    });
                    $scope.semesters = [];
                    $scope.semesters = result;
                }
            });
        }

        $scope.$watch("searchParams.program", function () {
            if ($scope.searchParams.program)
                $scope.loadDepartmentsForSelectedProgram();
        });

        $scope.toggleArrowIcon = function () {
            var myClass = $("#arrow_inSearch").attr("class");
            myClass = new String(myClass);
            if (myClass.includes("down")) {
                $("#arrow_inSearch").removeClass("icon-chevron-down");
                $("#arrow_inSearch").addClass("icon-chevron-right");
            }
            if (myClass.includes("right")) {
                $("#arrow_inSearch").addClass("icon-chevron-down");
                $("#arrow_inSearch").removeClass("icon-chevron-right");
            }
        }
    }

})();