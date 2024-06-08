const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashpassword,
    role: "user",
  });

  await newUser.save();
  return res
    .status(200)
    .json({ status: true, message: "Register Successfull" });
});

router.post("/login", async (req, res) => {
  const { email, password: passwordBody } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  const validPassword = await bcrypt.compare(passwordBody, user.password);
  if (!validPassword) {
    return res.status(404).json({ message: "Password incorrect" });
  }

  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "1h",
  });

  const { username, role } = user;

  res.cookie("token", token, { maxAge: 3600000 });
  res.cookie("username", username, { maxAge: 3600000 });
  res.cookie("role", role, { maxAge: 3600000 });

  return res.status(200).json({
    role: user.role,
    username: user.username,
    token,
    status: true,
    message: "Login successfull",
  });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aksel761@gmail.com",
        pass: "djhb tlbs ukko ckgg",
      },
    });

    var mailOptions = {
      from: "aksel761@gmail.com",
      to: email,
      subject: "Reset Password - No Reply",
      text: `http://localhost:5173/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({
          message: "Error sending email, please try again in a minute",
        });
      } else {
        return res.status(200).json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error sending email, please try again in a minute",
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;

    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Password Updated!" });
  } catch (err) {
    return res.json("Invalid token");
  }
});

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return res.json(err);
  }
};

router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("role");
  res.clearCookie("username");

  return res.json({ status: true });
});

router.get("/getInfo/:username", async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      message: "Error finding user",
    });
  }

  return res.status(200).json({
    status: true,
    username: user.username,
    email: user.email,
  });
});

router.post("/changeEmailUsername", async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        username: username,
        email: email,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Changes made successfully.",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/changePassword", async (req, res) => {
  const { password, username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Password incorrect.",
      });
    }

    const newHashPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        password: newHashPassword,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Changes made successfully.",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getAllUsers", async (req, res) => {
  const allUsers = await User.find();

  if (!allUsers) {
    return res.status(404).json({
      message: "Error finding user",
    });
  }

  const users = [];

  allUsers.map((user) => {
    users.push({ username: user.username, email: user.email, role: user.role });
  });

  return res.status(200).json({
    status: true,
    users,
  });
});

router.delete("/deleteUser/:username", async (req, res) => {
  try {
    const { username } = req.params;
    await User.findOneAndDelete({ username });

    return res.status(200).json({
      status: true,
    });
  } catch {
    return res.status(404).json({
      message: "Error finding user",
    });
  }
});

router.post("/changeRole", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user.role === "user") {
      user.role = "71a*Zl936";
    } else {
      user.role = "user";
    }
    await user.save();

    return res.status(200).json({
      status: true,
    });
  } catch {
    return res.status(404).json({
      message: "Error finding user",
    });
  }
});

module.exports = UserRouter = router;
