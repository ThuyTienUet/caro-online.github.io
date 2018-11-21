let SOCKET_IO = {};
let BOARD = [];
let START = [];
let WIN = [];
let PLAYER1 = [];
let PLAYER2 = [{
    username: '',
    isClicked: false,
    curPlayer: -1
}];
let LIST_USER_OF_ROOM = [];
let LIST_MESSAGE = [];
let RELOAD_ROOM = false;

SOCKET_IO.connect = function (io) {
    SOCKET_IO.io = io;
    io.on('connection', function (socket) {
        console.log('connected');

        SOCKET_IO.socket = socket;

        socket.on('joined', function (data) {
            let tmp = true;
            if (!LIST_USER_OF_ROOM[data.room.id]) LIST_USER_OF_ROOM[data.room.id] = [];
            LIST_USER_OF_ROOM[data.room.id].forEach(function (username, i) {
                if (username == data.user.username) tmp = false;
            })
            if (tmp == true) {
                LIST_USER_OF_ROOM[data.room.id].push(data.user.username);
            }
            if (BOARD[data.room.id] == undefined) {
                BOARD[data.room.id] = Array.matrix(15, 0);
            }
            PLAYER1[data.room.id] = {
                username: '',
                isClicked: true,
                curPlayer: 1
            }
            PLAYER2[data.room.id] = {
                username: '',
                isClicked: true,
                curPlayer: -1
            }
            PLAYER1[data.room.id].username = LIST_USER_OF_ROOM[data.room.id][0];
            
            socket.join(data.room.name);
            io.in(data.room.name).emit('joinedRoom',
                {
                    board: BOARD[data.room.id],
                    start: START[data.room.id],
                    listUser: LIST_USER_OF_ROOM[data.room.id],
                    listMess: LIST_MESSAGE[data.room.id],
                    player1: PLAYER1[data.room.id],
                    player2: PLAYER2[data.room.id]
                })
        })

        socket.on('click', function (data) {
            if (START[data.room.id] == true) {
                let curPlayer = 0;
                if (data.user.username == PLAYER1[data.room.id].username) {
                    curPlayer = PLAYER1[data.room.id].curPlayer;
                } else if (data.user.username == PLAYER2[data.room.id].username) {
                    curPlayer = PLAYER2[data.room.id].curPlayer;
                }
                if (curPlayer == 1 && PLAYER1[data.room.id].isClicked == false) {
                    BOARD[data.room.id][data.row][data.col] = curPlayer;
                    if (checkOnHorizontal(BOARD[data.room.id], data.row, data.col, curPlayer) === 1
                        || checkOnVertically(BOARD[data.room.id], data.row, data.col, curPlayer) === 1
                        || checkOnDiagonal(BOARD[data.room.id], data.row, data.col, curPlayer) === 1
                        || checkOnDiagonalMain(BOARD[data.room.id], data.row, data.col, curPlayer) === 1) {
                        WIN[data.room.id] = 'X';
                        io.in(data.room.name).emit('XO', { user: data.user, win: WIN[data.room.id], board: BOARD[data.room.id] });

                    } else {
                        io.in(data.room.name).emit('XO', { user: data.user, win: WIN[data.room.id], board: BOARD[data.room.id] });
                    }
                    PLAYER1[data.room.id].isClicked = true;
                    PLAYER2[data.room.id].isClicked = false;
                } else if (curPlayer == -1 && PLAYER2[data.room.id].isClicked == false) {
                    BOARD[data.room.id][data.row][data.col] = curPlayer;
                    if (checkOnHorizontal(BOARD[data.room.id], data.row, data.col, curPlayer) === 1
                        || checkOnVertically(BOARD[data.room.id], data.row, data.col, curPlayer) === 1
                        || checkOnDiagonal(BOARD[data.room.id], data.row, data.col, curPlayer) === 1
                        || checkOnDiagonalMain(BOARD[data.room.id], data.row, data.col, curPlayer) === 1) {

                        WIN[data.room.id] = 'O';
                        io.in(data.room.name).emit('XO', { user: data.user, win: WIN[data.room.id], board: BOARD[data.room.id] });

                    } else {
                        io.in(data.room.name).emit('XO', { user: data.user, win: WIN[data.room.id], board: BOARD[data.room.id] });
                    }
                    PLAYER2[data.room.id].isClicked = true;
                    PLAYER1[data.room.id].isClicked = false;
                }
            }
        });

        socket.on('startPlay', function (data) {
            if (data.user.username != PLAYER1[data.room.id].username) {
                if ((PLAYER2[data.room.id].username == '') || (PLAYER2[data.room.id].username == data.user.username)) {
                    PLAYER2[data.room.id].username = data.user.username;
                    if (START[data.room.id] == true) {
                        BOARD[data.room.id] = Array.matrix(15, 0);
                    }
                    START[data.room.id] = true;
                    WIN[data.room.id] = '';
                    PLAYER2[data.room.id].isClicked = true;
                    PLAYER1[data.room.id].isClicked = false;
                    io.in(data.room.name).emit('initBoard', { board: BOARD[data.room.id], player2: PLAYER2[data.room.id] });
                }
            } else {
                if (PLAYER2[data.room.id].username != '') {
                    if (START[data.room.id] == true) {
                        BOARD[data.room.id] = Array.matrix(15, 0);
                    }
                    START[data.room.id] = true;
                    WIN[data.room.id] = '';
                    PLAYER2[data.room.id].isClicked = true;
                    PLAYER1[data.room.id].isClicked = false;
                    io.in(data.room.name).emit('initBoard', { board: BOARD[data.room.id], player2: PLAYER2[data.room.id] });
                }
            }
        }) 

        socket.on('quitRoom', function (data) { 
            if (LIST_USER_OF_ROOM[data.room.id]) {
                LIST_USER_OF_ROOM[data.room.id].forEach(function (username, i) {
                    if (username == data.user.username) {
                        LIST_USER_OF_ROOM[data.room.id].splice(i, 1);
                        if (!LIST_USER_OF_ROOM[data.room.id].length) {
                            delete LIST_USER_OF_ROOM[data.room.id];
                            io.emit('deleteRoom', data.room);
                        } else {
                            if (i == 0) {
                                PLAYER1[data.room.id].username = LIST_USER_OF_ROOM[data.room.id][0];
                                PLAYER2[data.room.id].username = "";
                            } else if (username == PLAYER2[data.room.id].username) {
                                PLAYER2[data.room.id].username = "";
                            }
                            BOARD[data.room.id] = Array.matrix(15, 0);
                            io.in(data.room.name).emit('quitedRoom',
                                {
                                    listUser: LIST_USER_OF_ROOM[data.room.id],
                                    player1: PLAYER1[data.room.id],
                                    player2: PLAYER2[data.room.id],
                                    board: BOARD[data.room.id],
                                    event: data.event,
                                    member: data.user.username
                                });
                        }
                    }
                })
            }
            socket.leave(data.room.name);
        })

        socket.on('sendMess', function (data) {
            let tmp = {
                sender: data.user.username,
                content: data.content
            }
            if (!LIST_MESSAGE[data.room.id]) LIST_MESSAGE[data.room.id] = [];
            LIST_MESSAGE[data.room.id].push(tmp);
            io.in(data.room.name).emit('sended', LIST_MESSAGE[data.room.id]);
        })

        socket.on('cancelRoom', function (data) {
            io.in(data.name).emit('cancelledRoom', '');
        })
    })
};

Array.matrix = function (n, init) {
    let mat = [];
    for (let i = 0; i < n; i++) {
        let a = [];
        for (let j = 0; j < n; j++) {
            a[j] = init;
        }
        mat[i] = a;
    }
    return mat;
}

//kiem tra hang ngang
function checkOnHorizontal(board, cur_row, cur_col, cur_val) {
    let count_left = 0;
    let count_right = 0;
    //di sang trai so voi cur_pos
    for (let i = cur_col; i >= 0; i--) {
        if (board[cur_row][i] === cur_val) {
            count_left++;
        } else {
            break;
        }
    }
    //di sang phai so voi cur_pos
    for (let i = cur_col + 1; i < 15; i++) {
        if (board[cur_row][i] === cur_val) {
            count_right++;
        } else {
            break;
        }
    }
    if (count_left + count_right >= 5) {
        return 1;
    }
}

//kiem tra theo hang doc
function checkOnVertically(array_board, cur_row, cur_col, cur_val) {
    let count_up = 0;
    let count_down = 0;
    for (let i = cur_row; i < 15; i++) {
        if (array_board[i][cur_col] === cur_val) {
            count_down++;
        } else {
            break;
        }
    }
    for (let i = cur_row - 1; i >= 0; i--) {
        if (array_board[i][cur_col] === cur_val) {
            count_up++;
        } else {
            break;
        }
    }
    if (count_up + count_down >= 5) {
        return 1;
    }
}

//kiem tra duong cheo phu
function checkOnDiagonal(array_board, cur_row, cur_col, cur_val) {
    let count_right_up = 0;
    let count_left_down = 0;
    let temp1 = 0;
    let temp2 = 1;
    //kiem tra theo duong cheo phia tren ben phai so voi cur_pos
    for (let i = cur_row; i >= 0; i--) {
        if (array_board[i][cur_col + temp1] === cur_val) {
            count_right_up++;
            temp1++;
        } else {
            break;
        }
    }
    //kiem tra theo duong cheo phia duoi ben trai so voi cur_pos
    for (let i = cur_row + 1; i < 15; i++) {
        if (array_board[i][cur_col - temp2] === cur_val) {
            count_left_down++;
            temp2++;
        } else {
            break;
        }
    }
    if (count_left_down + count_right_up >= 5) {
        return 1;
    }
}

//kiem tra duong cheo chinh
function checkOnDiagonalMain(array_board, cur_row, cur_col, cur_val) {
    let count_right_down = 0;
    let count_left_up = 0;
    let temp1 = 0;
    let temp2 = 1;
    //kiem tra phia tren ben trai cua cur_pos
    for (let i = cur_row; i >= 0; i--) {
        if (array_board[i][cur_col - temp1] === cur_val) {
            count_left_up++;
            temp1++;
        } else {
            break;
        }
    }
    //kiem tra phia duoi ben trai so voi cur_pos
    for (let i = cur_row + 1; i < 15; i++) {
        if (array_board[i][cur_col + temp2] === cur_val) {
            count_right_down++;
            temp2++;
        } else {
            break;
        }
    }
    if (count_left_up + count_right_down >= 5) {
        return 1;
    }
}

module.exports.socket_io = SOCKET_IO;
