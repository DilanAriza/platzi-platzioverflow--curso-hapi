'use strict'

//Libs
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

//models
const questions = require('../models/index').questions;
const users = require('../models/index').users;

module.exports = {
    name: 'api-rest',
    version: '1.0.0',
    async register(server, options) {
        const prefix = options.prefix || 'api';

        await server.register(require('@hapi/basic'))
        server.auth.strategy('simple', 'basic', { validate: validateAuth })

        server.route({
            method: 'GET',
            path: `/${prefix}/question/{key}`,
            options: {
                auth: 'simple',
                validate: {
                    params: Joi.object({
                        key: Joi.string().required()
                    }),
                    failAction: failValidation
                }
            },
            handler: async(req, h) => {
                let result;
                try {
                    result = await questions.getOne(req.params.key);

                    if (!result) {
                        Boom.notFound(`No se pudo encontrar la pregunta ${req.params.key}`)
                    }
                } catch (error) {
                    Boom.badImplementation(`Hubo un error buscando ${req.params.key}`)
                }

                return result;
            }
        })

        server.route({
            method: 'GET',
            path: `/${prefix}/questions/{amount}`,
            options: {
                auth: 'simple',
                validate: {
                    params: Joi.object({
                        amount: Joi.number().integer().min(1).max(20).required()
                    }),
                    failAction: failValidation
                }
            },
            handler: async(req, h) => {
                let result;
                try {
                    result = await questions.getLast(req.params.amount);

                    if (!result) {
                        Boom.notFound(`No se pudo recuperar las preguntas`)
                    }
                } catch (error) {
                    Boom.badImplementation(`Hubo un error buscando las preguntas`)
                }

                return result;
            }
        })

        function failValidation(req, h, err) {
            return Boom.badRequest('Por favor use los parámetros correctos');
        }

        async function validateAuth(req, username, password, h) {
            let user;
            try {
                user = await users.validate({
                    email: username,
                    password: password
                })
            } catch (error) {
                server.log('error', error)
            }

            return {
                credentials: user || {},
                isValid: (user !== false)
            }
        }
    }
}