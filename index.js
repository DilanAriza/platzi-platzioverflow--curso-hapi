'use strict'

/*
    h.response(): Crea un objeto de respuesta.
    h.redirect(): Redirecciona una petición.
 */

// Requerir el modulo de hapi (Framework) y otras librerias
const Hapi = require('@hapi/hapi');
const Handlebars = require('handlebars');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const Path = require('path');

//rutas
const routes = require('./routes/routes');

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

        server.views({
            engines: {
                hbs: Handlebars
            },
            relativeTo: __dirname,
            path: 'views',
            layout: true,
            layoutPath: 'views'
        })

        server.route(routes);

        await server.start();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(`Servidor lanzado en ${server.info.uri}`)
}

init();