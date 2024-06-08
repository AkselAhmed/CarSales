const express = require("express");
const router = express.Router();
const Advertisement = require("../models/Advertisement.js");

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
    const advertisement = await Advertisement.create({
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
    const advertisements = await Advertisement.find();

    return res.status(200).json({ status: true, advertisements });
  } catch (error) {
    console.error("Error getting all advertisements:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error getting all advertisements" });
  }
});

router.get("/getAdvertisement/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const advertisement = await Advertisement.findOne({ _id: id });

    return res.status(200).json({ status: true, advertisement });
  } catch (error) {
    console.error("Error getting all advertisements:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error getting all advertisements" });
  }
});

router.post("/searchFilters", async (req, res) => {
  try {
    const { brand, model, engine, fromPrice, toPrice, fromYear, toYear, city } =
      req.body;

    const filter = {};
    if (brand) filter.brand = brand;
    if (model) filter.model = model;
    if (engine) filter.engine = engine;
    if (fromPrice.length !== 0 && toPrice.length !== 0) {
      filter.price = { $gte: fromPrice, $lte: toPrice };
    } else if (fromPrice.length !== 0) {
      filter.price = { $gte: fromPrice };
    } else if (toPrice.length !== 0) {
      filter.price = { $lte: toPrice };
    }
    if (fromYear.length !== 0 && toYear.length !== 0) {
      filter.productionYear = { $gte: fromYear, $lte: toYear };
    } else if (fromYear.length !== 0) {
      filter.productionYear = { $gte: fromYear };
    } else if (toYear.length !== 0) {
      filter.productionYear = { $lte: toYear.length };
    }
    if (city) filter.city = city;

    const advertisements = await Advertisement.find(filter);

    return res.status(200).json({ status: true, advertisements });
  } catch (error) {
    console.error("Error getting all advertisements:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error getting all advertisements" });
  }
});

router.delete("/deleteAdvertisement/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Advertisement.findOneAndDelete({ _id: id });

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error deleting advertisement", error);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting advertisement" });
  }
});

router.get("/userAdvertisements/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const advertisements = await Advertisement.find({ owner: username });

    return res.status(200).json({ status: true, advertisements });
  } catch (error) {
    console.error("Error getting advertisemens", error);
    return res
      .status(500)
      .json({ status: false, message: "Error getting advertisement" });
  }
});

router.post("/editAdvertisement", async (req, res) => {
  const { advertisementDetails, id } = req.body;

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
    await Advertisement.findByIdAndUpdate(
      { _id: id },
      {
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
      }
    );

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error updating advertisement", error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating advertisement" });
  }
});

router.post("/reportAdvertisement", async (req, res) => {
  const { id, description } = req.body;

  try {
    const advertisement = await Advertisement.findOneAndUpdate(
      { _id: id },
      {
        $push: { reportDescription: description },
      }
    );

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error reporting advertisement:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error reporting advertisement" });
  }
});

router.get("/getReportedAdvertisements", async (req, res) => {
  try {
    const advertisements = await Advertisement.find({
      reportDescription: { $exists: true, $not: { $size: 0 } },
    });

    return res.status(200).json({ status: true, advertisements });
  } catch (error) {
    console.error("Error getting reported advertisements:", error);
    return res.status(500).json({
      status: false,
      message: "Error getting reported advertisements:",
    });
  }
});

router.post("/ignoreAdvertisementReports", async (req, res) => {
  const { id } = req.body;
  try {
    await Advertisement.findOneAndUpdate(
      { _id: id },
      {
        $unset: { reportDescription: "" },
      }
    );

    return res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error reporting advertisement:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error reporting advertisement" });
  }
});

module.exports = AdvertisementRouter = router;
