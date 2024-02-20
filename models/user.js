const mongoose = require('mongoose');

const NameSchema = new mongoose.Schema({
    first_name: {type: String, required:true, minLength:2, maxLength:50},
    last_name: {type: String, required:true, minLength:2, maxLength:50}
})

const UserSchema = new mongoose.Schema({
    name: NameSchema,
    userName: {type: String, required:true, minLength:2, maxLength:50},
    password: {type: String, required:true},
    memberType: {type:String, enum: ["regular, member, admin"]}
})

module.exports = mongoose.model("User", UserSchema);