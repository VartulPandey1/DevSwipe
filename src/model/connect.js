const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    connectionRequestTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    connectionRequestFrom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (
    connectionRequest.connectionRequestFrom.equals(
      connectionRequest.connectionRequestTo
    )
  ) {
    throw new Error("Sender and Receiver are same");
  }
  next();
});
const connectionModel = mongoose.model("connectionModel", connectionSchema);

module.exports = connectionModel;
