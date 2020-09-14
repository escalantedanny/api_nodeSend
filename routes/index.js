const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');
const linksController = require('../controllers/linksController');
const fileController = require('../controllers/fileController');
const { check } = require('express-validator');

// LA FORMA DE BUSCAR LAS RUTAS
module.exports = function() {

    router.post('/usuarios',
        [
            check('name', 'El nombre es obligatorio').not().isEmpty(),
            check('email', 'Email no debe estar Vacio').not().isEmpty(),
            check('email', 'Agrega un email valido').isEmail(),
            check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }) 
        ], 
        usersController.createUser
    );

    router.post(
        '/auth', 
        authController.authenticateUser 
    );

    router.get(
        '/auth', 
        auth, 
        authController.authenticatedUser 
    );

    router.post(
        '/links',
        [
            check('name', 'El nombre es obligatorio').not().isEmpty(),
            check('name_origin', 'Email no debe estar Vacio').not().isEmpty()
        ], 
        auth, 
        linksController.createLinks
    );

    router.get(
        '/links/:url',
        linksController.getLinks,
        fileController.deleteFile
    );

    router.post(
        '/file', 
        auth,
        fileController.uploadFile
    );

    router.post(
        '/email', 
        usersController.sendEmail
    );

    // devolvemos la ruta
    return router;

}