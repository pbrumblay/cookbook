'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    givenName: String,
    familyName: String,
    imageUrl: String,
    picture: String,
    email: { type: String, index: { unique: true } },
    isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema, 'users');