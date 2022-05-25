const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");
const expressAsyncHandler = require("express-async-handler");

// expressAsyncHandler to handle all the ERRORs
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer ")) {
    // so out token will look like
    // Bearer adasdasdasdasdwedfsdf

    try {
      // so we will split and take the token
      token = authorization.split(" ")[1];

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }

      // now we verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // so we will find user in our database and store it without passwords
      // in req.user
      req.user = await User.findById(decoded.id).select({ password: 0 });

      next();
    } catch (Error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
