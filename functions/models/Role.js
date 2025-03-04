const mongoose = require("mongoose");

let RoleSchema = new mongoose.Schema(
  {
  name: String,
  created_at: { type: Date },
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

RoleSchema.pre("save", async function (next) {
  let role = this;
  if (this.isNew) {
    this.created_at = await new Date();
  }
});




module.exports = mongoose.model("role", RoleSchema);
