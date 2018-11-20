let express = require('express');
let router = express.Router();

let ctrlUser = require('../controllers/user');
let ctrlRoom = require('../controllers/room');

router.post('/login', (req, res) => {
    ctrlUser.login(req, res);
})
router.post('/register', (req, res) => {
    ctrlUser.register(req, res);
})

router.post('/room/list', (req, res) => {
    ctrlRoom.getListRoom(req, res);
})
router.post('/room/new', (req, res) => { 
    ctrlRoom.createRoom(req, res);
})
router.post('/room/delete', (req, res) => {
    ctrlRoom.deleteRoom(req, res);
})

router.post('/user/point/update', (req, res) => {
    ctrlUser.updatePoint(req, res);
})
router.post('/user/list', (req, res) => {
    ctrlUser.getListUser(req, res);
})
router.post('/user/delete', (req, res) => {
    ctrlUser.deleteUser(req, res);
})
module.exports = router;