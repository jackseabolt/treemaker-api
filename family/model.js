'use strict'; 

const mongoose = require('mongoose'); 

const FamilySchema = mongoose.Schema({
    family_name: { type: String, required: true }, 
    password: { type: String, required: true }, 
    members: [
        {
            fname: { type: String, required: true }, 
            lname: { type: String, required: true }, 
            mname: { type: String }, 
            birth_date: { type: String },
            birth_town: { type: String }, 
            birth_state: { type: String },  
            death_date: { type: String }, 
            death_town: { type: String }, 
            death_state: { type: String }, 
            short_bio: { type: String }, 
            long_bio: {type: String }, 
            parents: [
                { 
                    id: { type: String, required: true, unique: true }
                } 
            ], 
            siblings: [
                { 
                    id: { type: String, required: true, unique: true }
                } 
            ],
            children: [
                { 
                    id: { type: String, required: true, unique: true }
                } 
            ], 
            pictures: [
                { 
                    url: { type: String, required: true, unique: true }
                } 
            ],  
            
        }
    ]
}); 

FamilySchema.methods.apiRepr = function() {
    return {
        fmaily_name: this.family_name,
        members: this.members
    }
}

FamilySchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10); 
}

FamilySchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password); 
}

const Family = mongoose.models.Family || mongoose.model('Family', FamilySchema); 

module.exports = { Family }; 