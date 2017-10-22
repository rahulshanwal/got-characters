var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
   name: String,
   image: String,
   dialog: String,
   description: String
});

module.exports = mongoose.model("Member", memberSchema);