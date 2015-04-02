'use strict';
(function (angular) {
    function routeProviderConfig($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/template/dashboard',
            controller: 'dashboard as vm'
        });
    }
    
    angular.module('dashboard', ['ngRoute']).config(['$routeProvider', routeProviderConfig]);
})(angular);