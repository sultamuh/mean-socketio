const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserModel = new Schema({
  username: {
    type: String
  },  
}, {
  collection: 'users'
})

module.exports = mongoose.model('UserModel', UserModel)