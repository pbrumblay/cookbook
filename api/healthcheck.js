'use strict';

const mongoose = require('mongoose');

let healthCheck = (function () {
    return {
        hello: function(request, reply) {
            return reply(null, {
                message: 'Hello'
            }).code(200);
        },

        live: function(request, reply) {
            let state = mongoose.connection.readyState;
            if(state === 0) return reply(null, {
                message: 'Disconnected. Cannot reach DB.'
            }).code(500);
            else return reply(null, {
                message: 'Alive'
            }).code(200);
        },

        ready: function(request, reply) {
            let state = mongoose.connection.readyState;
            if(state !== 1) return reply(null, {
                message: 'Not ready. Mongoose connection state is: ' + state
            }).code(500);
            else return reply(null, {
                message: 'Ready'
            }).code(200);
        }
    }
})();

module.exports = healthCheck;