// chatName
// isGroupChat
// users
// latestMessages
//groupAdmin

const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    // Array bcz a single chat will have two users and a grp chat will have many
    users: [
      {
        // contains id to that particular user
        type: mongoose.Schema.Types.ObjectId,
        // we will create a model for User and ref points to it
        ref: "User",
      },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
