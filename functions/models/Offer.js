const mongoose = require("mongoose");
const User = require("./User");
const Organization = require("./Organization")
const Schema = mongoose.Schema

let OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 55,
    },
    description: {
      type: String,
      maxlength: 255,
    },
    imageUrl: {
      type: String,
    },
    offerViews: {
      type: Number,
    },
    offerState: {
      type: String,
    },
    date_of_creation: { type: Date },
    date_of_publication: { type: Date },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true
    },
    organizationName: {
      type: Schema.Types.ObjectId,
      ref: Organization,

    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OfferSchema.pre("save", async function (next) {
  let offer = this;

  if (this.isNew) {
    this.date_of_creation = await new Date();
    this.offerState = "inactive";
    this.offerViews = 0;
  }
});

module.exports = mongoose.model("offer", OfferSchema);
