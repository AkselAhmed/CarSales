const express = require("express");
const router = express.Router();
const Carlist = require("../models/Carlist.js");

router.get("/getCarlist", async (req, res) => {
  try {
    const carList = await Carlist.find();

    if (!carList) {
      return res
        .status(404)
        .json({ message: "No car brands and models found" });
    }

    return res.status(200).json({
      carList,
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/getmodels", async (req, res) => {
  const { brand } = req.body;
  try {
    const car = await Carlist.findOne({ brand });
    if (!car) {
      return res.status(404).json({ message: "Car brand not found" });
    }

    const { models } = car;

    return res.status(200).json({
      models,
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getbrands", async (req, res) => {
  try {
    const brands = await Carlist.distinct("brand");
    res.status(200).json({ status: true, brands });
  } catch (error) {
    console.error("Error fetching car brands:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/addBrand", async (req, res) => {
  const { brand } = req.body;
  try {
    const car = await Carlist.findOne({ brand });
    if (car) {
      return res.status(404).json({ message: "Car brand already exists" });
    }

    const newBrand = new Carlist({
      brand,
    });

    await newBrand.save();

    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deleteBrand/:brand", async (req, res) => {
  const { brand } = req.params;
  try {
    await Carlist.findOneAndDelete({ brand });

    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/addModel", async (req, res) => {
  const { brand, model } = req.body;
  try {
    const car = await Carlist.findOne({ brand });
    if (!car) {
      return res.status(404).json({ message: "No car brand found" });
    }

    const { models } = car;
    models.push(model);

    await car.save();

    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/editModels", async (req, res) => {
  const { brand, models } = req.body;
  try {
    await Carlist.findOneAndUpdate({ brand }, { models });

    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/editBrand", async (req, res) => {
  const { brand, newBrand } = req.body;

  try {
    const car = await Carlist.findOne({ brand });
    if (!car) {
      return res.status(404).json({ message: "No car brand found" });
    }

    car.brand = newBrand;

    await car.save();

    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = CarlistRouter = router;
