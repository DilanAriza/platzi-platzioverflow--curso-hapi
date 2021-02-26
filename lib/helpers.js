'use strict'

const handlerbars = require('handlebars');

function registerHelpers() {
    handlerbars.registerHelper('answerNumber', (answers) => {
        const keys = Object.keys(answers)
        return keys.length
    })

    handlerbars.registerHelper('ifEquals', (a, b, options) => {
        if (a === b) {
            return options.fn(this)
        }

        return options.inverse(this)
    })

    return handlerbars
}

module.exports = registerHelpers();