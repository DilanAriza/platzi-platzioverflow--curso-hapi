'use strict'

class Questions {
    constructor(db) {
        this.db = db;
        this.ref = this.db.ref('/');
        this.collection = this.ref.child('questions')
    }

    async create(info, user, filename) {

        const data = {
            ...info
        }

        const content = {
            description: data.description,
            title: info.title,
            owner: user
        }

        if (filename) {
            content.filename = filename
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

    async setAnswerRight(questionId, answerId, user) {
        const query = await this.collection.child(questionId).once('value');
        const question = query.val()
        const answers = question.answers;

        if (!user.eemail == question.owner.email) {
            return false
        }

        for (let key in answers) {
            answers[key].correct = (key == answerId)
        }

        const update = await this.collection.child(questionId).child('answers').update(answers)
        return update;
    }
}

module.exports = Questions;