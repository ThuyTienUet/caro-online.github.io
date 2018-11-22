angular
    .module('caroOnline', ['angularModalService', 'ngRoute'])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/intro/intro.html',
                controller: 'introCtrl'
            })
            .when('/home', {
                templateUrl: 'src/home/home.html',
                controller: 'homeCtrl'
            })
            .when('/room', {
                templateUrl: 'src/room/room.html',
                controller: 'roomCtrl'
            })
            .when('/login', {
                templateUrl: 'src/login/login.html',
                controller: 'loginCtrl'
            })
            .when('/register', {
                templateUrl: 'src/register/register.html',
                controller: 'registerCtrl'
            })
            .when('/admin', {
                templateUrl: 'src/administration/administration.html',
                controller: 'adminCtrl'
            })
            .otherwise({ redirectTo: '/' });
    }])

