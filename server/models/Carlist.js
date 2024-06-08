const mongoose = require("mongoose");

const CarlistSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, unique: true },
    models: [{ type: String, unique: true }],
  },
  {
    collection: "cars",
  }
);

const CarlistModel = mongoose.model("Carlist", CarlistSchema);

module.exports = CarlistModel;
