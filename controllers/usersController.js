const Users    = require('../models/Users.js');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
var nodemailer = require('nodemailer'); // email sender function 

/** Obtiene un cliente en especifico por su ID */
exports.createUser = async (req, res, next) => {

    // check errors
    let errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    const { email, password } =  req.body;

    try {
        // verify user unique
        let user = await Users.findOne({ email });
        if(user) {
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }
        
        user = new Users(req.body);
        // hashear password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt)
        user.save();

        res.json({msg: 'Usuario creado correctamente'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al crear el usuario'})
        next();
    }
}

exports.authUser = async (req,res, next) => {
    try {
        
    } catch (error) {
        console.log(error);
        const data = {
            msg : 'ups tenemos un problema con el servidor'
        }
        res.json(data);
        res.status(500).json({ msg: 'Hubo un error'})
        next();
    }
}

exports.sendEmail = async (req, res, next) => {

    try {

        const asunto = ` 
            Nombre ${req.body.name}
            email: ${req.body.mail}
            telefono: ${req.body.phone}
            comentario: ${req.body.obser}`

        // nodemailer stuff will go here
        var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'danny.ezequiel@gmail.com',
                    pass: 'D322102015d4*3'
                }
        });
        var mailOptions = {
                from: 'danny.ezequiel@gmail.com',
                to: 'spain@airlife.com',
                bcc: 'danny.ezequiel@gmail.com',
                subject: req.body.name+' Desea que lo contacten',
                text: asunto
        };
        const email = await transporter.sendMail(mailOptions, function(error, info){
            if (error){
                console.log(error);
                res.send(500, error.message);
            } else {
                const data = {
                    msg : 'Su correo fue enviado satisfactoriamente. Le responderemos a la brevedad'
                }
                res.json(data);
                console.log("Email sent");
                res.status(200).jsonp(req.body);
            }
        });
    } catch (error) {
        console.log(error);
        const data = {
            msg : 'ups tenemos un problema con el envio del correo'
        }
        res.json(data);
        res.status(500).json({ msg: 'Hubo un error al obtener los clientes'})
        next();
    }
};
