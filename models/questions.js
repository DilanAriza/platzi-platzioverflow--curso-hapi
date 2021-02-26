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

    async getLast(amount) {
        const query = await this.collection.limitToLast(amount).once('value');
        const data = query.val();

        return data;
    }

    async getOne(id) {
        const query = await this.collection.child(id).once('value');
        const data = query.val();

        return data;
    }

    async answer(data, user) {

        const content = {
            ...data
        }
        const pushData = {
            text: content.answer,
            user: user
        }

        console.log(pushData)

        const answers = await this.collection.child(data.id).child('answers').push({
            text: content.answer,
            user: user
        });

        return answers;
    }
}

module.exports = Questions;