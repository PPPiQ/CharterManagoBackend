const mongoose = require("mongoose");

let OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    created_at: { type: Date },
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
