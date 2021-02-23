'use strict'

//Lib
const Joi = require('@hapi/joi');

//Controllers
const site = require('../controllers/site');
const user = require('../controllers/user');

module.exports = [

    //Render home
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ['index.html']
            }
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: site.home
    },


    // Register
    {
        method: 'GET',
        path: '/register',
        handler: site.register
    },
    {
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().min(3),
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(3)
                })
            }
        },
        path: '/create-user',
        handler: user.createUser
    },


]