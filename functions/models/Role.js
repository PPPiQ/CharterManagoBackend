const mongoose = require("mongoose");

let RoleSchema = new mongoose.Schema({
  name: String,
});

RoleSchema.pre("save", async function (next) {
  let role = this;
  let date_info = new Date();
  let date_into =
    date_info.getDate() +
    "/" +
    (date_info.getMonth() + 1) +
    "/" +
    date_info.getFullYear();
  this.created_at = await date_into;
});

module.exports = mongoose.model("role", RoleSchema);
