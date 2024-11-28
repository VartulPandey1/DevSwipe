const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const connection = require("../model/connect.js");
const user = require("../model/user.js");
const connectionRoute = express.Router();

connectionRoute.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const reqSendFrom = req.user._id;
      const reqSendTo = req.params.userId;
      const isReceiverPresentInDB = await user.findOne({ _id: reqSendTo });
      if (!isReceiverPresentInDB) {
        throw new Error("User not present whom the request is sent");
      }
      const allowedStatus = ["ignored", "interested"];
      if (allowedStatus.includes(status)) {
        const isConnectionAlerdyExist = await connection.findOne({
          $or: [
            {
              connectionRequestFrom: reqSendFrom,
              connectionRequestTo: reqSendTo,
            },
            {
              connectionRequestFrom: reqSendTo,
              connectionRequestTo: reqSendFrom,
            },
          ],
        });
        if (isConnectionAlerdyExist) {
          throw new Error("Connection Already exist");
        } else {
          const newConnection = new connection({
            connectionRequestTo: reqSendTo,
            connectionRequestFrom: reqSendFrom,
            status: status,
          });
          await newConnection.save();
          res.send(`${status} Connection `);
        }
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

connectionRoute.post(
  "/request/review/:status/:requestId",
  userAuth,
  async(req, res) => {
    try {
      const { status, requestId } = req.params;
      const currentUserId = req.user._id
      const allowedStatus = ["accepted","rejected"]
      if(!allowedStatus.includes(status))
      {
        throw new Error("status not allowed")
      }
      const requestData = await connection.findOne({connectionRequestFrom:requestId,connectionRequestTo:currentUserId})
      if(status === requestData.status)
      {
        throw new Error("Status already set")
      }
      if(requestData.connectionRequestTo.toString() === currentUserId.toString())
      {
        requestData.status=status
        const dataAfterChanges = await requestData.save()
        res.send(`request updated successfully ${dataAfterChanges}`)
      }
      else{
        throw new Error("Not the receivers ID")
      }
    } catch (err) {
      res.send(err.message);
    }
  }
);
module.exports = { connectionRoute };
