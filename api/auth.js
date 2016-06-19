'use strict';

const User = require("./model/user");
const UserLog = require("./model/userLog");
const Boom = require('boom');
const appClientId = process.env.APP_CLIENT_ID;

//lifted: http://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
function getContent(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err))
    })
};

function checkUser(json) {
    return User.findOne({ "email": json.email }).then(u => {
        return logLogin(u, json);
    });
}

function logLogin(u, json) {
    let log = new UserLog();
    log.email = json.email;
    log.lastLogin = new Date();
    return log.save().then(d => {
        return u;
    });
}

function validateToken(idToken) {
    let url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + idToken;
    return getContent(url)
        .then(data => {
            const json = JSON.parse(data);
            if(json.aud !== appClientId) {
                console.error('client ids do not match!');
            } else {
                checkUser(json).then(result => {
                    return logLogin(result.json);
                });
            }
        });
}

function login(request, reply) {
    if(!request.payload || !request.payload.idToken) {
        return Boom.badRequest("Bad login request.");
    }
    return reply(validateToken(request.payload.idToken));
}

module.exports = {
    login: login
}