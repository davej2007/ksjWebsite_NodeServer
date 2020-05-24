const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
    date    : { type : Number, default : 0 },
    type    : { type : Number, default : 0 },
    home    : { by      : { type : String, default : 'n/a' },
                checks  : { water   : { type : Boolean, default : false },
                            windows : { type : Boolean, default : false },
                            doors   : { type : Boolean, default : false } },
                comments: { type : String, default : 'n/a' } },
    agent   : { time    : { type : String, default : 'n/a' },
                name    : { type : String, default : 'n/a' },
                feedback: { type : String, default : 'n/a' } },
    bins    : { type    : { type : String, default : 'n/a' },
                used    : { type : Boolean, default : true } }  
});
module.exports = mongoose.model('Visit',visitSchema);