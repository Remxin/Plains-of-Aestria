const mongoose = require("mongoose")

const fractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  lider: {
    type: Object,
    required: true
  },
 
  cards: {
      type: Array,
      default: []
  }
});

const Fraction = mongoose.model("fraction", fractionSchema);
module.exports = Fraction;
