const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

const USER = 'User';

class User {
    constructor(email, fullName, givenName, familyName, picture) {
        this.email = email;
        this.fullName = fullName;
        this.givenName = givenName;
        this.familyName = familyName;
        this.picture = picture;
        this.isAdmin = false;
    }

    save() {
        const key = datastore.key([USER, this.email]);
        const dbUser = {
            key: key,
            data: [
                {
                    name: 'email',
                    value: this.email,
                },
                {
                    name: 'fullName',
                    value: this.fullName,
                },
                {
                    name: 'givenName',
                    value: this.givenName,
                },
                {
                    name: 'familyName',
                    value: this.familyName,
                },
                {
                    name: 'picture',
                    value: this.picture,
                },
                {
                    name: 'isAdmin',
                    value: this.isAdmin,
                },

            ]
        }

        return datastore.upsert(dbUser).then(r => {
            console.log(`User Saved ${this.email}`);
            return this;
        });
    }

    upsert() {
        return User.find(this.email).then(u => {
            if(u != null) {
                this.isAdmin = u.isAdmin;
            }
            return this.save();
        })
    }

    static find(email) {
        const query = datastore.createQuery(USER)
            .filter('email', '=', email);

        return datastore.runQuery(query).then(r => {
            if(r.length && r[0] && r[0].length) {
                return r[0][0];
            } else {
                return null;
            }
        });
    }
}

module.exports = User;