const mongoose = require("mongoose");

let GroupSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      maxlength: 100,
    },
    created_at: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GroupSchema.pre("save", async function (next) {
  let group = this;
  if (this.isNew) {
    this.created_at = await new Date();
  }
});

module.exports = mongoose.model("group", GroupSchema);
