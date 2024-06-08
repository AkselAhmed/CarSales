const mongoose = require("mongoose");

const PendingAdvertisementSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    engine: { type: String, required: true },
    phone: { type: String, required: true },
    mileage: { type: Number, required: true },
    postDate: { type: Date, default: Date.now },
    productionYear: { type: Number, required: true },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String, default: "There is no description." },
  },
  {
    collection: "pendingAdvertisements",
  }
);

const PendingAdvertisementModel = mongoose.model(
  "PendingAdvertisement",
  PendingAdvertisementSchema
);

module.exports = PendingAdvertisementModel;
