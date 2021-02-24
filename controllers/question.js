'use strict'

const questions = require('../models/index').questions;

async function createQuestion(req, h) {
    let result;

    try {
        result = await questions.create(req.payload, req.state.user);
        console.log(`Pregunta creadad con el ID ${result}`);
    } catch (error) {
        console.error(`Ocurrio un error: ${error}`);

        return h.view('ask', {
            title: 'Crear pregunta',
            error: 'Problema creando la pregunta'
        }).code(500).takeover();

    }

    return h.response(`Pregunta creadad con el ID ${result}`)
}

module.exports = {
    createQuestion
};