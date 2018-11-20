'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);

var configDb = require('config').get('db');

var sequelize = new Sequelize(configDb.db_name, configDb.user, configDb.password, configDb.options);
var Op = Sequelize.Op;
var db = {};

db.User = require('./schemas/user.js').define(sequelize, Sequelize);
db.Room = require('./schemas/room.js').define(sequelize, Sequelize);

db.Room.hasMany(db.User, {
    foreignkey: {
        name: 'idRoom',
        allowNull: true
    } 
})

sequelize.sync().then(()=>{
    console.log('\n============================ SYNC DATABASE SUCCESS ====================\n');
}).catch(err=>{
    console.log('\n============================ SYNC DATABASE ERROR ======================\n', err);
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

module.exports = db;
