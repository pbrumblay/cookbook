const User = require("./model/user");
const UserLog = require("./model/user-log");
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
    const u = new User(json.email,json.name,json.given_name,json.family_name,json.picture);
    console.log(json);
    console.log(u.email);
    console.log(u.fullName);
    console.log(u.givenName);
    console.log(u.familyName);
    console.log(u.picture);
    return u.upsert();
}

function logLogin(u) {
    console.log('### logLogin')
    console.log(u);
    const log = new UserLog(u.email, new Date(), uuid.v4());
    return log.save();
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

    let user;
    return validateToken(request.payload.idToken)
        .then(u => {
            user = u;
            return logLogin(u);
        })
        .then(l => {
            console.log('LOG::::');
            console.log(l);
            const encodedToken = jwt.sign(l.authToken, jwtSecret);
            reply({ isAdmin: user.isAdmin, fullName: user.fullName, picture: user.picture, authToken: encodedToken })
        })
        .catch(e => {
            console.log(e);
            reply(e)
        });
}

function isValidUser(decoded, request, callback) {
    console.log(`Checking valid user: ${decoded}`);
    UserLog.find(decoded)
        .then(log => {
            if(!log) {
                callback(Boom.unauthorized('Token not found', false))
            }
            console.log('logging log');
            console.log(log);
            return log;
        })
        .then(log => {
            console.log('logging log');
            console.log(log);
            User.find(log.email)
        })
        .then(u => {
            callback(null, true, u);
        })
        .catch(e => {
            console.log(e);
        });
}

function isAdminUser(decoded, request, callback) {
    console.log(`Checking admin: ${decoded}`);
    UserLog.find(decoded)
        .then(log => {
            if(!log) {
                callback(Boom.unauthorized('Token not found', false))
            }
            return log;
        })
        .then(log => User.find(log.email))
        .then(u => {
            console.log(u);
            if(!u.isAdmin) {
                callback(Boom.unauthorized('Admin access required.', false));
            } else {
                callback(null, true, u)
            }
        }).catch(e => {
            console.log(e);
        });
}

module.exports = {
    login,
    isValidUser,
    isAdminUser,
}