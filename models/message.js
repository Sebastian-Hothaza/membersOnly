const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    username: {type: Schema.Types.ObjectID, ref: "User", required: true},
    message: {type: String, required:true, minLength:2, maxLength:200},
    timestamp: {type: Date, required:true}
})

module.exports = mongoose.model("Message", MessageSchema);