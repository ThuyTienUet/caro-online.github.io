angular
    .module('caroOnline')
    .controller('homeCtrl', homeCtrl);

function homeCtrl($scope, $http, auth, $location, $window, $timeout, dialog) {
    if (auth.isLoggedIn() == false) {
        $location.path('/')
    }
    let tmp = {};
    $scope.rooms = [];
    $scope.users = [];
    $scope.isAdmin = false;
    let user = JSON.parse(auth.getUser());
    
    if (user.role == 1) $scope.isAdmin = true;

    socket.on('deleteRoom', function (data) {
        $http.post('/api/room/delete', data)
            .then(function successCallback(dt) {
                $scope.rooms.forEach(function (room, i) {
                    if (room.id == data.id) {
                        $scope.rooms.splice(i, 1);
                    }
                })
            }, function errorCallback(err) {
                console.log(err);
            })
    })

    $http.post('/api/user/list', tmp)
        .then(function successCallback(data) {
            $scope.users = data.data.listUser;
        }, function errorCallback(err) {
            console.log(err);
        })

    $http.post('/api/room/list', tmp)
        .then(function successCallback(data) {
            $scope.rooms = data.data.listRoom;
        }, function errorCallback(err) {
            console.log(err);
        })

    $scope.cancelRoom = function (room) {
        socket.emit('cancelRoom', room)
        
        $http.post('/api/room/delete', room)
            .then(function successCallback(dt) {
                $scope.rooms.forEach(function (room_, i) {
                    if (room_.id == room.id) {
                        $scope.rooms.splice(i, 1);
                    }
                })
                $location.path('/home')
            }, function errorCallback(err) {
                console.log(err);
            })
    }
    $scope.addRoom = function () {
        dialog.nameRoom(function (result) {
            if (result) {
                $window.sessionStorage['room'] = JSON.stringify(result);
                $location.path('/room')
            }
        })
    }

    socket.on('roomNew', function (data) {
        $timeout(function () {
            $scope.rooms.push(data)
        })
    })

    $scope.joinRoom = function (roomName, roomId) {
        let room = {
            name: roomName,
            id: roomId
        }
        $window.sessionStorage['room'] = JSON.stringify(room);
        $location.path('/room')
    } 
}
