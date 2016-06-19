'use strict';

const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
    email: String,
    lastLogin: Date
});

module.exports = mongoose.model('UserLog', userLogSchema, 'userLogs');