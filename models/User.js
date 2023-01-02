const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    type : { type: String, required:true ,enum: ["admin", "user"], default: "user"},
    createdAt: { type: Date},
    updatedAt: { type: Date}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);