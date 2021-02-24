'use strict'

const Boom = require('@hapi/boom');
const users = require('../models/index').users;


async function createUser(req, h) {
    let result
    try {
        result = await users.create(req.payload);
    } catch (error) {
        console.error(error)
        return h.view('register', {
            title: 'Registro',
            error: 'Error creando el usuario'
        })
    }

    return h.view('register', {
        title: 'Registro',
        success: 'usuario creado exitosamete'
    })
}

async function validateUser(req, h) {
    let result
    try {
        result = await users.validateUser(req.payload);

        if (!result) {
            return h.view('login', {
                title: 'Login',
                error: 'Error Email y/o contraseña incorrecta'
            })
        }


    } catch (error) {
        console.error(error);
        return h.view('login', {
            title: 'Login',
            error: 'Problemas validando el usuario'
        })
    }

    return h.redirect('/').state('user', {
        name: result.name,
        email: result.email
    })
}

async function logout(req, h) {
    return h.redirect('login').unstate('user')
}

function failValidation(req, h, err) {
    const templates = {
        '/create-user': 'register',
        '/validate-user': 'login',
        '/create-question': 'ask'
    };
    console.log(req.path)
    return h.view(templates[req.path], {
        title: 'Error de validación',
        error: 'Por favor, complete los campos requeridos'
    }).code(404).takeover()
}

module.exports = {
    createUser,
    validateUser,
    logout,
    failValidation,
}