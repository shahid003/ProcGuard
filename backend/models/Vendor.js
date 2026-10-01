const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number
});

module.exports = mongoose.model("Vendor", schema);
