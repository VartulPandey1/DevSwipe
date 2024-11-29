const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const connection = require("../model/connect.js");
const User = require("../model/user.js");
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await connection
      .find({
        connectionRequestTo: userId,
        status: "interested",
      })
      .populate(
        "connectionRequestFrom",
        "firstName lastName age photoURL skills gender about"
      );
    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await connection
      .find({
        $or: [
          { connectionRequestTo: userId, status: "accepted" },
          { connectionRequestFrom: userId, status: "accepted" },
        ],
      })
      .populate(
        "connectionRequestTo",
        "firstName lastName age photoURL skills gender about"
      )
      .populate(
        "connectionRequestFrom",
        "firstName lastName age photoURL skills gender about"
      );
    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    let { page, limit } = req.query;
    page ? (page = page) : (page = 1);
    limit ? (limit <= 10 ? limit : (limit = 10)) : (limit = 5);
    const skip = (page - 1) * limit;
    const userId = req.user._id;
    const userWithConnection = await connection
      .find({
        $or: [
          { connectionRequestTo: userId },
          { connectionRequestFrom: userId },
        ],
      })
      .populate("connectionRequestTo", "_id")
      .populate("connectionRequestFrom", "_id");
    const notFeedUserSet = new Set();
    userWithConnection.forEach((data) => {
      notFeedUserSet.add(data.connectionRequestTo._id);
      notFeedUserSet.add(data.connectionRequestFrom._id);
    });
    const notFeedUserArray = [...notFeedUserSet];
    console.log(notFeedUserArray);
    const data = await User.find({
      $and: [
        { _id: { $nin: notFeedUserArray } },
        { _id: { $nin: userId } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.send(data);
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = userRouter;
