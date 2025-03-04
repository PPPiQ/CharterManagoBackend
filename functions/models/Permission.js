const mongoose = require("mongoose");

let PermissionSchema = new mongoose.Schema(
  {
    binary: {
      type: Buffer,
      unique: true
    },
    code: {
      type: String,
      unique: true
    },
    description: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PermissionSchema.pre("save", async function (next) {
  let permission = this;
  // if (this.isNew) {
  //   // TODO: if needed add conditions
  // }
});

module.exports = mongoose.model("permission", PermissionSchema);
