const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

const app = express();

app.use(express.json()); // to accept JSON data from our frontend

// all routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------------------------------------Deployment------------------------------------

const __dirname1 = path.resolve();

const res = process.env.NODE_ENV === "production";
console.log(res);
if (res) {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

// --------------------------------------------------------Deployment------------------------------------

app.use(notFound);
app.use(errorHandler);

connectDB();
const port = process.env.PORT || 5000;
const server = app.listen(port, function () {
  console.log(`Server started at port:${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // we create a new socket for a user on the basis of his id
  console.log("Connetion to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });

  //Mine
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  //Mine

  socket.on("newMessage", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("MessageRecieved", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
