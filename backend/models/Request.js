const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  itemName: String,
  quantity: Number,
  vendorId: String,
  status: String
});

module.exports = mongoose.model("Request", schema);
