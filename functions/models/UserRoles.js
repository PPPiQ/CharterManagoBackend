const mongoose = require("mongoose");
const Role = require("./Role");
const User = require("./User");

let UserRolesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Role,
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
