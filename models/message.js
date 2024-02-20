const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectID, ref: "User", required: true},
    title: {type: String, required:true, minLength:2, maxLength:20},
    message: {type: String, required:true, minLength:2, maxLength:200},
    timestamp: {type: Date, required:true}
})

module.exports = mongoose.model("Message", MessageSchema);