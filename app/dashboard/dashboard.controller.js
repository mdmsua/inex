'use strict';
(function (module) {
    module.controller('dashboard', [function () {
        var vm = this;
        vm.accounts = Math.floor(Math.random() * 10);
    }]);
})(angular.module('dashboard'));