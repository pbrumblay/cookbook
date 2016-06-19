'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    givenName: String,
    familyName: String,
    imageUrl: String,
    email: String,
    isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema, 'users');