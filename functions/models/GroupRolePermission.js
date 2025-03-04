const mongoose = require("mongoose");
const Permission = require("./Permission");
const Group = require("./Group");
const UserRoles = require("./UserRoles");

let GroupRolePermission = new mongoose.Schema(
  {
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Permission,
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Group,
    },
    user_role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserRoles
    },
    created_at: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GroupRolePermission.pre("save", async function (next) {
  let groupRolePermission = this;
  if (this.isNew) {
    this.created_at = await new Date();
  }
});

module.exports = mongoose.model("group-role-permission", GroupRolePermission);
