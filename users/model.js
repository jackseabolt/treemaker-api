'use strict'; 

const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 

mongoose.Promsie = global.Promise; 

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    email: { type: String, required: true }, 
    firstName: { type: String },
    lastName: { type: String },
    families: [
        {
            family_key: { type: String, required: true }, 
            family_name: { type: String }
        }
    ]
}); 

UserSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email, 
        families: this.families 
    }; 
}; 

UserSchema.methods.hashPassword = function(password) {
    return bcrypt.hash(password, 10); 
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password); 
}

const User = mongoose.models.User || mongoose.model('User', UserSchema); 

module.exports = { User }; 