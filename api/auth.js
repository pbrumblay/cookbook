const User = require("./model/user");
const UserLog = require("./model/userLog");
const Boom = require('boom');
const appClientId = process.env.APP_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const uuid = require('uuid');


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
    const newU = {
        email: json.email,
        fullName: json.name,
        givenName: json.given_name,
        familyName: json.family_name,
        picture: json.picture,
    }
    return User.findOneAndUpdate({ email: json.email }, newU, { upsert: true });
}

function logLogin(u) {
    const log = new UserLog();
    log.email = u.email;
    log.lastLogin = new Date();
    log.authToken = uuid.v4();
    u.authToken = jwt.sign(log.authToken, jwtSecret);
    return log.save().then(() => u);
}

function validateToken(idToken) {
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`;
    return getContent(url)
        .then(data => {
            const json = JSON.parse(data);
            if (json.aud !== appClientId) {
                return Boom.badRequest('Client IDs do not match!');
            }
            return json;
        })
        .then(json => checkUser(json));
}

function login(request, reply) {
    if(!request.payload || !request.payload.idToken) {
        return Boom.badRequest('Bad login request.');
    }

    return validateToken(request.payload.idToken)
        .then(u => logLogin(u))
        .then(u => reply({ isAdmin: u.isAdmin, fullName: u.fullName, picture: u.picture, authToken: u.authToken }))
        .catch(e => {
            console.log(e);
            reply(e)
        });
}

function isValidUser(decoded, request, callback) {
    UserLog.findOne({ authToken: decoded })
        .then(log => {
            if(!log) {
                callback(Boom.unauthorized('Token not found', false))
            }
            return log;
        })
        .then(log => User.findOne({ email: log.email }))
        .then(u => {
            callback(null, true, u)
        });
}

function isAdminUser(decoded, request, callback) {
    UserLog.findOne({ authToken: decoded })
        .then(log => {
            if(!log) {
                callback(Boom.unauthorized('Token not found', false))
            }
            return log;
        })
        .then(log => User.findOne({ email: log.email }))
        .then(u => {
            if(!u.isAdmin) {
                callback(Boom.unauthorized('Admin access required.', false));
            } else {
                callback(null, true, u)
            }
        });
}

module.exports = {
    login,
    isValidUser,
    isAdminUser,
}