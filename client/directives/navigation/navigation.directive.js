
angular
.module('airQuality')
.directive('navigation', navigation);
function navigation() {
return {
    restrict: 'EA',
    templateUrl: 'directives/navigation/navigation.html',
    controller: 'navigationCtrl'
};
}
