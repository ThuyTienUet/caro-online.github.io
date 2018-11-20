angular
    .module('caroOnline')
    .service('auth', authentication);
authentication.$inject = ['$window', '$http', '$location'];
function authentication($window, $http, $location) {
    var saveUser = function (user) {
        $window.sessionStorage['user'] = JSON.stringify(user);
    }
    var getUser = function () {
        if (!$window.localStorage['user']) {
            return $window.sessionStorage['user']
        } else {
            return $window.localStorage['user'];
        }
    }

    var login = function (user, cb) {
        return $http.post('/api/login', user)
            .then(function successCallback(data) {
                if (data.data.code == 200) {
                    saveUser(data.data.user.user);
                }
                cb(data.data);
            }, function errorCallback(err) {
                console.log(err);
            });
    };

    var register = function (user, callback) {
        return $http.post('/api/register', user)
            .then(function successCallback(data) {
                callback(data.data);
            }, function errorCallback(err) {
                console.log(err);
            });
    }
    var logout = function () {
        $window.sessionStorage.removeItem('user');
        $window.localStorage.removeItem('user');
        $location.path('/')
    };
    var isLoggedIn = function () {
        var user = getUser();
        if (user) {
            return true;
        } else {
            return false;
        }
    };

    return {
        getUser: getUser,
        login: login,
        register: register,
        logout: logout,
        isLoggedIn: isLoggedIn
    };
}