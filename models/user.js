const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  account_number: {
    type: Number,
    unique : true,
    dropDups: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_admin: {
    type: Boolean,
    default: false,
    required: true
  },
  connections: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);