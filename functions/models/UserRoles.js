const mongoose = require("mongoose");
const Role = require("./Role");
const User = require("./User");

let UserRolesSchema = new mongoose.Schema(
  {
    group_name: {
      type: String
    },
    created_at: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserRolesSchema.pre("save", async function (next) {
  let role = this;
  if (this.isNew) {
    this.created_at = await new Date();
  }
});

module.exports = mongoose.model("user_roles", UserRolesSchema);
