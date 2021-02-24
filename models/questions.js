'use strict'

class Questions {
    constructor(db) {
        this.db = db;
        this.ref = this.db.ref('/');
        this.collection = this.ref.child('questions')
    }

    async create(data, user) {

        const content = {
            ...data
        }

        content.owner = user;

        const question = this.collection.push(content);

        return question.key
    }
}

module.exports = Questions;