const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./User");
db.role = require("./Role");
db.offer = require("./Offer");
db.organization = require("./Organization")

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;