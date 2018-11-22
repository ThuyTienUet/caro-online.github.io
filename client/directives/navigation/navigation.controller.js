
angular
    .module('caroOnline')
    .controller('navigationCtrl', navigationCtrl);

function navigationCtrl($scope, $window, auth) {

    $scope.isLoggedIn = false;
    $scope.name = "";
    $scope.isAdmin = false;

    $scope.logout = function () {
        $window.sessionStorage.removeItem('user-token');
        auth.logout();
        $scope.isLoggedIn = false;
        window.location.href;
    };

    $scope.isLoggedIn = auth.isLoggedIn();

    if ($scope.isLoggedIn == true) {
        let user = JSON.parse(auth.getUser());
        if (user.role == 1) $scope.isAdmin = true;
        $scope.name = user.username;
    }
}
