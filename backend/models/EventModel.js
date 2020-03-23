const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventModel = new Schema({
    _id: {
        type: String
    },
    event_type: {
        type: String
    },
    msg: {
        type: String
    },
}, {
    timestamps: true,
    collection: 'events'
})

module.exports = mongoose.model('EventModel', EventModel)