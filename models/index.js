'use strict'

const Firebase = require('firebase-admin');

//Credentials
const serviceAccount = require('../config/firebase.json');

Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccount),
    databaseURL: 'https://platzioverflow-12595-default-rtdb.firebaseio.com/'
});

const db = Firebase.database();

const Users = require('./users');

module.exports = {
    users: new Users(db)
}