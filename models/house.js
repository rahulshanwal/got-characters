var mongoose = require("mongoose");

var houseSchema = new mongoose.Schema({
   name: String,
   sigil: String,
   motto: String,
   history: String,
   members: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Member"
      }
   ]
});

module.exports = mongoose.model("House", houseSchema);