var models = require('../database/db-connect');
var Room = models.Room;
var User = models.User;
var socket_io = require('../socket.io/socket.io').socket_io

module.exports.getListRoom = (req, res) => {
    Room.findAll({
        include: {
            model: User
        }
    }).then(list => {
        if (list) {
            res.send({ code: 200, content: "SUCCESSFULLY", listRoom: list })
        } else {
            res.send({ code: 404, content: "NOT FOUND" });
        }
    }).catch(err => {
        res.send({ code: 401, content: "SOMETHING WENT WRONG: " + err })
    })
}

module.exports.createRoom = (req, res) => {
    Room.findOne({
        where: {
            name: req.body.name
        }
    }).then((room) => {
        if (room == null) {
            Room.create({
                name: req.body.name
            }).then((room) => {  
                console.log(room.dataValues.name);
                
                socket_io.io.emit('roomNew', room.dataValues);
                socket_io.socket.join(room.dataValues.name);
                res.send({ code: 200, content: "SUCCESSFULLY", room: { id: room.dataValues.id, name: room.dataValues.name, numUser: 1 } })
            })
        } else {
            res.send({ code: 401, content: "CREATE ROOM FAIL" })
        }
    }).catch((err) => {
        res.send({ code: 401, content: "SOMETHING WENT WRONG: " + err })
    })
}

module.exports.deleteRoom = (req, res) => {
    Room.destroy({
        where: {
            id: req.body.id
        }
    }).then((result) => {
        if (result == 1) {
            res.send({ code: 200, content: "SUCCESSFULLY" })
        } else {
            res.send({ code: 404, content: "NOT FOUND" })
        }
    }).catch((err) => {
        res.send({ code: 401, content: "SOMETHING WENT WRONG: " + err })
    })
}

