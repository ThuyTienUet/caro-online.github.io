angular
    .module('caroOnline')
    .controller('registerCtrl', registerCtrl);

//registerCtrl.$inject = ['$location', 'authentication', '$http'];
function registerCtrl($location, auth, $http, $scope) {
    $scope.user = {
        username: "",
        password: "",
        cf_password: ""
    };

    //$scope.returnPage = $location.search().page || '/';

    $scope.onSubmit = function () {
        $scope.formError = "";
        if (!$scope.user.username || !$scope.user.password || !$scope.user.cf_password) {
            $scope.formError = "All fields required, please try again";
            return false;
        } else if ($scope.user.password != $scope.user.cf_password) {
            $scope.formError = "Confirm password is not match, please try again";
            return false;
        } else {
            doRegister();
        }
    };

    function doRegister() {
        $scope.formError = "";
        auth
            .register($scope.user, function (data) {
                if (data.code === 200) {
                    $location.path('/login');
                } else {
                    $scope.formError = "Username exist already";
                }
            })

    };
}
