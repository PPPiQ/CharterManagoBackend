const mongoose = require("mongoose");
const User = require("./User");
const GroupRolePermission = require("./GroupRolePermission");

let OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    created_at: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: User },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: GroupRolePermission,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OrganizationSchema.pre("save", async function (next) {
  let organization = this;
  if (this.isNew) {
    this.created_at = await new Date();
  }
});

module.exports = mongoose.model("organization", OrganizationSchema);
