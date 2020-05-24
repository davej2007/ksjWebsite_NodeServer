const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const operationSchema = new Schema({
    userID:String,
    name:String,
    password:String,
    admin:String
});

operationSchema.pre('save', function (next) {
    var operation = this;
    console.log('Pre Save password ', operation.password);
    if(operation.password!==undefined){
        console.log('new Hash')
        bcrypt.hash(operation.password, null, null, function(err, hash) {
            if(err) return next(err);
            operation.password = hash;
            next();
        });
    } else {
        next();
    }
  });

operationSchema.methods.comparePassword = function(password){
   return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Operation',operationSchema);