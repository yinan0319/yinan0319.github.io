const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db= {};
db.mongoose = mongoose;

db.user = require('./user.model');
db.course = require('./course.model');
module.exports = db;  
