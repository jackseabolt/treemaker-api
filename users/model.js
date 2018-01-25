'use strict'; 

const mongoose = require('mongoose'); 

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

const User = mongoose.models.User || mongoose.model('User', UserSchema); 

module.exports = { User }