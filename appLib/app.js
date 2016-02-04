var app = angular.module('myApp', ['ngTouch','ngRoute', 'ui.bootstrap', 'ngSanitize', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.selection','LocalStorageModule']);

// configure our routes
app.config(function ($routeProvider, $httpProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'appPg/mainPg.html',
            controller: 'mainCtrl'
        });
});
