'use strict'

function register(req, h) {
    if (req.state.user) {
        return h.redirect('/');
    }

    return h.view('register', {
        title: 'Registro',
        user: req.state.user
    });
}

function login(req, h) {
    if (req.state.user) {
        return h.redirect('/');
    }

    return h.view('login', {
        title: 'Ingresar',
        user: req.state.user
    });
}

function home(req, h) {
    return h.view('index', {
        title: 'home',
        user: req.state.user
    });
}

function notFound(req, h) {
    return h.view('404', {}, { layout: 'error-layout' }).code(404)
}

function failNotFound(req, h) {
    const response = req.response
    if (response.isBoom && response.output.statusCode === 404) {
        return h.view('404', {}, { layout: 'error-layout' }).code(404)
    }

    return h.continue
}

module.exports = {
    login,
    register,
    home,
    notFound,
    failNotFound,
}