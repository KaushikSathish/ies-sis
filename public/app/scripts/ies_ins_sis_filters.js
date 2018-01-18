(function () {
    'use strict';
    var App = angular.module('app');

    App.filter('camelCase', function () {
        var camelCaseFilter = function (input) {
            if (!input) {
                return input;
            }

            //convert every part of input separated by space to camel case - first char in upper and rest in lower
            var words = input.split(' ');
            for (var i = 0, len = words.length; i < len; i++) {
                if (words[i].length > 0) {
                    var camelCase = words[i].charAt(0).toUpperCase();

                    if (words[i].length > 1) {
                        camelCase += words[i].slice(1).toLowerCase();
                    }
                    words[i] = camelCase;
                }
            }

            return words.join(' ');
        };
        return camelCaseFilter;
    });
})();