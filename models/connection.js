const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
  sender: {
    type: Number,
    required: true
  },
  receiver: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Declined'],
    required: true
  },
}, {timestamps: true});

module.exports = mongoose.model('Connection', connectionSchema);