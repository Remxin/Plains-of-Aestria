const mongoose = require("mongoose")

const cardShema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  fraction: {
    type: Object,
    required: true
  },
 
  type: {
      type: String
  },

  file_path: {
      type: String
  },

  hp: {
      type: Number,
  },

  atk: {
      type: Number
  },

  mana: {
      type: Number
  }

});

const Card = mongoose.model("card", cardShema);
module.exports = Card;
