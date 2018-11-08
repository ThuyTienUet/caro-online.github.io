angular
    .module('airQuality', ['ngRoute'])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/home/home.html',
                controller: 'homeCtrl'
            })
            .otherwise({ redirectTo: '/' });
    }])
