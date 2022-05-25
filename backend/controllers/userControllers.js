const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userModel.js");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  console.log("in register user");

  // Now we fetch data from the signUp form
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this Email, Try another one");
  }

  //registration
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  console.log("execution was here");
  const { email, password } = req.body;

  // now we will use this user variable
  const user = await User.findOne({ email });

  // this matchPassword function is created in userModel
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = expressAsyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        // $or is an Operator in mongoDB  mean search in both
        // options ->  "i"   means case INsensitive
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keywords).find({
    _id: { $ne: req.user._id },
  });

  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
