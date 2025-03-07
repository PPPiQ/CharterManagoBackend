const mongoose = require("mongoose");
const Role = require("./Role");

let UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 100,
    },
    lastName: {
      type: String,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    password: { type: String, required: true, select: false },
    created_at: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  if (this.isNew) {
    this.created_at = await new Date();
  }
});

module.exports = mongoose.model("user", UserSchema);
