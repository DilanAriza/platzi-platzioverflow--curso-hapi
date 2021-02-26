'use strict'

/*
    h.response(): Crea un objeto de respuesta.
    h.redirect(): Redirecciona una petición.
 */

// Requerir el modulo de hapi (Framework) y otras librerias
const Hapi = require('@hapi/hapi');
const handlerbars = require('./lib/helpers');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const Path = require('path');
const good = require('@hapi/good');
const goodConsole = require('@hapi/good-console');

//rutas
const routes = require('./routes/routes');

//controlador
const site = require('./controllers/site');

//Metodos
const methods = require('./lib/methods')

// Configurar el servidor de nuestra aplicación. En un contenedor (Docker) si marca error colocar 0.0.0.0 (todos)
const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

// Definicion de función para inicializar el proyecto. Intenamnete hay tareas asincronas
async function init() {

    try {
        await server.register(Inert);
        await server.register(Vision);
        await server.register({
            plugin: good,
            options: {
                reporters: {
                    console: [{
                            module: goodConsole
                        },
                        'stdout'
                    ]
                }
            }
        })

        server.method('setAnswerRight', methods.setAnswerRight)
        server.method('getLast', methods.getLast, {
            cache: {
                expiresIn: 1000 * 60,
                generateTimeout: 2000
            }
        })

        server.state('user', {
            ttl: 100 * 60 * 60 * 24 * 7,
            isSecure: process.env.NODE_ENV === 'prod',
            encoding: 'base64json'
        })

        server.views({
            engines: {
                hbs: handlerbars
            },
            relativeTo: __dirname,
            path: 'views',
            layout: true,
            layoutPath: 'views'
        })

        server.ext('onPreResponse', site.failNotFound)
        server.route(routes);

        await server.start();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    server.log('info', `Servidor lanzado en ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
    server.log('unhandledRejection', error.message, error)
})


process.on('uncaughtException', error => {
    server.log('uncaughtException', error.message, error)
})

init();