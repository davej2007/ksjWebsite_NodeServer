const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partySchema = new Schema({
    date: Number,
    partyID:String,
    title:String,
    hostName:String,
    startTime:String,
    duration:String,
    venue:String,
    type:String,
    messageScreens: Boolean,
    songBook: Boolean,
});

module.exports = mongoose.model('Party',partySchema);