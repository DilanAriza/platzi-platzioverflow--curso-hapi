'use strict'

const Bcrypt = require('bcrypt');

class Users {
    constructor(db) {
        this.db = db;
        this.ref = this.db.ref('/');
        this.connection = this.ref.child('users');
    }

    async create(data) {

        const user = {
            ...data
        }

        user.password = await this.constructor.encrypt(user.password);

        const newUser = this.connection.push(user);
        return newUser.key;
    }

    static async encrypt(password) {
        const saltRounds = 10;
        const hashPassword = await Bcrypt.hash(password, saltRounds);

        return hashPassword;
    }
}

module.exports = Users