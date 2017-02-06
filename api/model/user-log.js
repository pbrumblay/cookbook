const Datastore = require('@google-cloud/datastore');
const datastore = Datastore({
    projectId: 'cookbook-1180'
});
const USERLOG = 'UserLog';
const USER = 'User';

class UserLog {
    constructor(email, lastLogin, authToken) {
        this.email = email;
        this.lastLogin = lastLogin;
        this.authToken = authToken;

        console.log(this.email);
        console.log(this.lastLogin);
        console.log(this.authToken);
    }

    save() {
        console.log(this.email);
        console.log(this.lastLogin);
        console.log(this.authToken);
        const key = datastore.key([USERLOG, this.authToken]);
        const dbUserLog = {
            key: key,
            data: [
                {
                    name: 'email',
                    value: this.email,
                },
                {
                    name: 'lastLogin',
                    value: this.lastLogin,
                },
                {
                    name: 'authToken',
                    value: this.authToken,
                },
            ]
        }

        return datastore.insert(dbUserLog).then(r => {
            console.log(`UserLog Created ${this.email}`);
            return this;
        });
    }

    static find(authToken) {
        const query = datastore.createQuery(USERLOG)
                .filter('authToken', '=', authToken);

        return datastore.runQuery(query).then(r => {
            if(r.length && r[0] && r[0].length) {
                return r[0][0];
            } else {
                return null;
            }
        });
    }
}

module.exports = UserLog;