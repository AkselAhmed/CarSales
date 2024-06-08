const UserRouter = require("./routes/user.js");
const CarlistRouter = require("./routes/carlist.js");
const AdvertisementRouter = require("./routes/advertisement.js");
const PendingAdvertisementRouter = require("./routes/pendingAdvertisement.js");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", UserRouter);
app.use("/carlist", CarlistRouter);
app.use("/advertisement", AdvertisementRouter);
app.use("/pendingAdvertisement", PendingAdvertisementRouter);

mongoose.connect("mongodb://localhost:27017/authentication");

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
