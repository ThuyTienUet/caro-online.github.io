
angular
	.module('caroOnline')
	.controller('loginCtrl', loginCtrl);

function loginCtrl($location, auth, $http, $scope, $window) {
	$scope.user = {
		username: "",
		password: ""
	};

	$scope.onSubmit = function () {
		$scope.formError = "";
		if (!$scope.user.username || !$scope.user.password) {
			$scope.formError = "All fields required, please try again";
			return false;
		} else {
			doLogin();
		}
	};

	function doLogin() {
		$scope.formError = "";
		auth
			.login($scope.user, function (data) {
				if (data.code != 200) {
					$scope.formError = "Username or password is incorrect"
				} else {
					$location.path('/home')
				}
			})
	};
	let checkbox = false;
	$scope.rememberMe = function () {
		checkbox = !checkbox;
		if (checkbox == true) {
			$window.localStorage['user'] = JSON.stringify($scope.user);
		}
	}
}
