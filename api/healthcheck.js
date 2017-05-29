'use strict';

const mongoose = require('mongoose');

let healthCheck = (function () {
    return {
        hello: (request, reply) => {
            return reply(null, {
                message: 'Hello'
            }).code(200);
        },

        live: (request, reply) => {
            return reply(null, {
                message: 'Alive'
            }).code(200);
        },

        ready: (request, reply) => {
            return reply(null, {
                message: 'Ready'
            }).code(200);
        }
    }
})();

module.exports = healthCheck;