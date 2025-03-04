const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.group = require("./Group");
db.group_permission = require("./GroupRolePermission");
db.offer = require("./Offer");
db.organization = require("./Organization");
db.permission = require("./Permission");
db.role = require("./Role");
db.user = require("./User");
db.user_roles = require("./UserRoles");

module.exports = db;