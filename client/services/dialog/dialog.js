angular
    .module('caroOnline')
    .service('dialog', dialogUtils);

function dialogUtils(ModalService) {
    let dialogUtils = {};

    dialogUtils.nameRoom = function (callback) {

        function ctrl($scope, $http,close) {
            $scope.name = "";
            $scope.formError = "";
            this.onOkButtonClicked = function () {
                if ($scope.name == "") {
                    $scope.formError = "All fields required, please try again";
                } else {
                    let room = {
                        name: $scope.name
                    }
                    $http.post('/api/room/new', room)
                        .then(function successCallback(data) {
                            if (data.data.code == 200) {
                                callback(data.data.room);
                                close($scope.name);
                            } else {
                                $scope.formError = "Name room exist";
                            }
                        }, function errorCallback(err) {
                            console.log(err);
                        })
                }
            };
            this.onCancelButtonClicked = function () {
                close(null);
            };
        }

        ModalService.showModal({
            templateUrl: '/services/dialog/dialog.html',
            controller: ctrl,
            controllerAs: "wiModal"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (data) {
                $('.modal-backdrop').last().remove();
                $('body').removeClass('modal-open');
            });
        });
    }
    return dialogUtils;
}
