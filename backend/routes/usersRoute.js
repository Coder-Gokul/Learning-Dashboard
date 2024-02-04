//Importing Router from express
const router = require("express").Router();
//Importing userModel file
const User = require("../models/userModel");
//Importing bcrypt for encrytion
const bcrypt = require("bcryptjs");
//Importing JWT
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

//Register a new user
router.post("/register", async (req, res) => {
  try {
    //check if user already exist
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    //Save the user
    const user = new User(req.body);
    await user.save();
    res.send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//Login a user
router.post("/login", async (req, res) => {
  try {
    //check if user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }
    //Check if the password is correct
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCorrect) {
      throw new Error("Invalid Password");
    }
    //Create and assign a token

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    res.send({
      success: true,
      data: token,
      message: "User logged in sucessfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get Logged in User
router.get("/get-logged-in-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    //Remove password from the user object
    user.password = undefined;
    res.send({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
