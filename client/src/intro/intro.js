angular
    .module('caroOnline')
    .controller('introCtrl', introCtrl);

function introCtrl(auth, $location) {
    if (auth.isLoggedIn() == true) {
        $location.path('/home')
    }
}
