const express = require("express");
const router = express.Router();
const PendingAdvertisement = require("../models/PendingAdvertisement.js");

router.post("/createAdvertisement", async (req, res) => {
  const { advertisementDetails } = req.body;
  const {
    image,
    brand,
    model,
    engine,
    price,
    phone,
    mileage,
    city,
    productionYear,
    owner,
    description,
  } = advertisementDetails;

  try {
    const advertisement = await PendingAdvertisement.create({
      image,
      brand,
      model,
      engine,
      price,
      productionYear,
      phone,
      mileage,
      city,
      owner,
      description,
    });

    return res.status(200).json({ status: true, advertisement });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error creating advertisement" });
  }
});

router.get("/getAllAdvertisements", async (req, res) => {
  try {
    const advertisements = await PendingAdvertisement.find();

    return res.status(200).json({ status: true, advertisements });
  } catch (error) {
    console.error("Error getting all advertisements:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error getting all advertisements" });
  }
});

router.delete("/deleteAdvertisement/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await PendingAdvertisement.findOneAndDelete({
      _id: id,
    });

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting advertisement" });
  }
});

module.exports = PendingAdvertisementRouter = router;
