angular
    .module('caroOnline')
    .controller('roomCtrl', roomCtrl);

function roomCtrl($scope, $window, $timeout, $http, $rootScope, $route, $location, auth) {

    if (auth.isLoggedIn() == false) {
        $location.path('/')
    }
    let room = JSON.parse($window.sessionStorage['room']);
    let user = JSON.parse(auth.getUser());

    $scope.listUser = [];
    $scope.content = "";
    $scope.listMess = [];
    $scope.isBossRoom = false;
    $scope.win = false;

    socket.emit('joined', { room: room, user: user });

    socket.on('joinedRoom', function (data) {
        $timeout(function () {
            $scope.listUser = data.listUser;
            $scope.listMess = data.listMess;
            $scope.board = data.board;
            $scope.player1 = data.player1;
            if (data.player2) {
                $scope.player2 = data.player2;
            } else {
                $scope.player2 = {}
            }
            if ($scope.player1.username == user.username) {
                $scope.isBossRoom = true;
            }
        })
    })

    socket.on('initBoard', function (data) {
        $timeout(function () {
            $scope.win = false;
            $scope.board = data.board;
            $scope.player2 = data.player2;
        })
    });

    $scope.start = function () {
        if (user.username == $scope.player1.username || user.username == $scope.player2.username || $scope.player2.username == "") {
            socket.emit('startPlay', { user: user, room: room });
            var timeleft = 30;
            // var downloadTimer = setInterval(function () {
            //     document.getElementById("time").innerHTML = timeleft--;
            //     if (timeleft < 0) {
            //         timeleft = 30;
            //     }
            // }, 1000);
        }
    }

    $rootScope.$on('$locationChangeSuccess', function () {
        $rootScope.actualLocation = $location.path();
    });

    $rootScope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {
        if ($rootScope.actualLocation === newLocation) {
            if (newLocation == '/home' && oldLocation == '/room') {
                socket.emit('quitRoom', { room: room, user: user });
                console.log(newLocation, oldLocation);
            }
        }
    });

    $scope.quit = function () {
        socket.emit('quitRoom', { room: room, user: user });
        $location.path('/home')
    }

    socket.on('quitedRoom', function (data) {
        $timeout(function () {
            $scope.listUser = data.listUser;
            $scope.player1 = data.player1;
            $scope.player2 = data.player2;
            $scope.board = data.board;
        })
    })

    socket.on('deleteRoom', function () {
        $location.path('/home')
    })

    $scope.clickXO = function (row, col) {
        if ($scope.win == false) {
            if ($scope.board[row][col] == 0) {
                if ($scope.board != undefined) {
                    socket.emit('click', {
                        row: row,
                        col: col,
                        room: room,
                        user: user
                    });
                }
            }
        }
    }

    socket.on('XO', function (data) {
        $timeout(function () {
            if (data.win == '') {
                $scope.board = data.board;
            }
            else {
                $scope.board = data.board;
                $scope.win = true;
                let user = {
                    username: data.user.username
                }
                $http.post('/api/user/point/update', user)
                    .then(function successCallback(data) {
                        $scope.playerWin = user.username;
                    }, function errorCallback(err) {
                        console.log(err);
                    })
            }
        })
    });

    $scope.sendMess = function () {
        socket.emit('sendMess', { user: user, room: room, content: $scope.content })
    }

    $scope.enterSendMess = function (e) {
        if (e.keyCode == 13) {
            socket.emit('sendMess', { user: user, room: room, content: $scope.content })
        }
    }

    socket.on('sended', function (data) {
        $timeout(function () {
            $scope.listMess = data;
            $scope.content = "";
        })
    })
}
