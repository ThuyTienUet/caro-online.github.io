angular
    .module('caroOnline')
    .controller('adminCtrl', adminCtrl);

function adminCtrl($scope, $window, $timeout, $http) {

    $scope.users = [];
    $http.post('/api/user/list')
        .then(function successCallback(data) {
            $scope.users = data.data.listUser;
        }, function errorCallback(err) {
            console.log(err);
        })

    $scope.deleteUser = function (id) {
        console.log(id);
        
    }
}
