const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  sender: {
    type: Number,
    required: true
  },
  receiver: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    enum: [0.005, 0.01],
    default: 0.01,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Done', 'Undone'],
    required: true
  },
  is_undone: {
    type: Boolean,
    default: false,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Transaction', transactionSchema);