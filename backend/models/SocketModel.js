const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SocketModel = new Schema({
  socket_id: {
    type: String
  },
  created_by: {
    type: String
  },  
}, {
  timestamps: true,
  collection: 'sockets'
})

module.exports = mongoose.model('SocketModel', SocketModel)