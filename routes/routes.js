'use strict'

//Lib
const Joi = require('@hapi/joi');

//Controllers
const site = require('../controllers/site');
const user = require('../controllers/user');
const { users } = require('../models');

module.exports = [

    //Render home
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
        path: '/create-user',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().min(3),
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(3)
                }),
                failAction: users.failValidation
            }
        },
        handler: user.createUser
    },

    //Login
    {
        method: 'GET',
        path: '/login',
        handler: site.login
    },
    {
        path: '/validate-user',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(3)
                }),
                failAction: user.failValidation
            }
        },
        handler: user.validateUser
    },

    //logout
    {
        method: 'GET',
        path: '/logout',
        handler: user.logout
    },


    //Rendering 
    {
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ['index.html']
            }
        }
    },

    //Error
    {
        method: ['GET', 'POST'],
        path: '/{any*}',
        handler: site.notFound
    },

]