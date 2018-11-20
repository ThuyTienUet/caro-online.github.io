let path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
let routes = require('./routes/index');
require('./socket.io/socket.io').socket_io.connect(io);
const models = require('./database/db-connect');


const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '../client')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'))
});
app.use(bodyParser.json());

app.use('/api', routes);

server.listen(6001, function () {
	console.log('\n============================ LISTENING ON PORT 6001================================\n');
});

