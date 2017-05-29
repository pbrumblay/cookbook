const UserLog = require('../api/model/user-log.js');
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore({
    projectId: 'cookbook-1180'
});
const USER = 'User';
const USERLOG = 'UserLog';
const EMAIL = 'foo@bar.com';
const TOKEN = 'abc123';
const test = require('tape');


const sut = new UserLog(EMAIL, new Date(), TOKEN);

test('Create, Check Login', t => {

    sut.save()
        .then(() => UserLog.find('abc123'))
        .then(r => {
            t.equal(r.authToken, 'abc123');
            t.end();
        })
        .catch(err => {
            console.error(err);
            t.fail(err)
        })
        .then(() => {
            const key = datastore.key([USER, EMAIL, USERLOG, TOKEN]);
            return datastore.delete(key);
        });
});

