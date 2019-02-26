const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cartSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  item: {
    type: Schema.Types.ObjectId,
    ref: 'Items'
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },

  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Cart', cartSchema);