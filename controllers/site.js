'use strict'

function register(req, h) {
    return h.view('register', {
        title: 'Registro',
        user: req.state.user
    });
}

function login(req, h) {
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

module.exports = {
    login,
    register,
    home
}