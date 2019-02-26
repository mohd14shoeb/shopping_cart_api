const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  name: {
    type: String,
    required: [true, "item name is required..."]
  },

  price: {
    type: Number,
    required: [true, "price is required..."]
  },

  shoppingImage: {
    type: String,
    required: [true, "shopping image must be included..."]
  },

  creator: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users"
    }
  ],
  
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Items", itemSchema);
