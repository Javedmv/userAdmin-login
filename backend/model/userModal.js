const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter the name']
    },
    email:{
        type:String,
        required:[true,'please enter the email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please enter the password']
    },
    isBlock:{
        type:Boolean,
        default: false
    }
},{
    timestamps:true
})

module.exports = mongoose.model('User',userSchema)