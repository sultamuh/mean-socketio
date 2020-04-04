const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageModel = new Schema({
    socket_id: {
        type: String
    },
    event_type: {
        type: String
    },
    user_name: {
        type: String
    },
    room_name: {
        type: String
    },
    msg: {
        type: String
    },
}, {
    timestamps: true,
    collection: 'messages'
})

module.exports = mongoose.model('MessageModel', MessageModel)