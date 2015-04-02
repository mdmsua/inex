'use strict';
(function (angular) {
    function mdIconProviderConfig($mdIconProvider) {
        var path = '/svg/';
        ['action', 'alert', 'av', 'communication', 'content', 'device', 'editor', 'file', 'hardware',
            'image', 'maps', 'navigation', 'notification', 'social', 'toggle'].forEach(function (set, n) {
                var url = path + set + '.svg';
                if (n === 0) {
                    $mdIconProvider.defaultIconSet(url);
                } else {
                    $mdIconProvider.iconSet(set, url);
                }
            });
    }

    function locationProviderConfig($locationProvider) {
        $locationProvider.html5Mode(true);
    }

    function config($mdIconProvider, $locationProvider) {
        mdIconProviderConfig($mdIconProvider);
        locationProviderConfig($locationProvider);
    }

    angular.module('expenses', ['ngMaterial', 'dashboard'])
        .config(['$mdIconProvider', '$locationProvider', config]);
})(angular);