import express from "express";
import bcrypt from "bcrypt";
import { User} from "../../Models/User.js";
import { decodeJwtToken, generateJwtToken } from "../../service.js";

let router = express.Router();

//SignUp
router.post("/signup", async (req, res) => {
  try {
    //Find User is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({ message: "Email already registered" });

    //generate hashed password
    let salt = await bcrypt.genSalt(9);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Add new user to DB
    let newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }).save();

    //generate jwtToken
    let token = generateJwtToken(newUser._id);
    res.status(200).json({ message: "SignUp Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    //Find User is available
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    //Validate password
    let validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword)
      return res.status(400).json({ message: "Invalid Credentials" });

    //generate jwtToken
    let token = generateJwtToken(user._id);
    res.status(200).json({ message: "Login Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ merror: err.message });
  }
});

//Reset password
router.put("/reset-password", async (req, res) => {
  try {
    //Find User is available
    let email = req.body.email;
    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    //generate hashed password
    let salt = await bcrypt.genSalt(9);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    let updatePassword = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    //generate jwtToken
    let token = generateJwtToken(user._id);
    res.status(200).json({ message: "Password Reseted Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Get User Data by Token
router.get("/get-user-data", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });

    res.status(200).json({ message: "User Data Got Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Get User Data by Email
router.get("/get-user-data-by-email", async (req, res) => {
  try {
    let email = req.headers["email"];
    let user = await User.findOne({ email: email });
    res.status(200).json({ message: "User Data Got Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Update User Data
router.put("/update-user-data", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);

    //Updating User Data
    let updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          channelName: req.body.name,
          image: req.body.image,
          avatar: req.body.avatar,
        },
      }
    );
    res.status(200).json({ message: "User Data Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

//Delete User
router.delete("/delete-user", async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findByIdAndDelete({ _id: userId });

    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

export let authRouter = router;
