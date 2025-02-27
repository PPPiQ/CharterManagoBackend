const mongoose = require("mongoose");
const Role = require("./Role");

let UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      maxlength: 100,
    },
    lastname: {
      type: String,
      maxlength: 100,
    },
    name: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    password: { type: String, required: true, select: false },
    created_at: { type: String },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Role
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  let date_info = new Date();
  let date_into =
    date_info.getDate() +
    "/" +
    (date_info.getMonth + 1) +
    "/" +
    date_info.getFullYear();
  this.created_at = await date_into;
});

module.exports = mongoose.model("user", UserSchema);
