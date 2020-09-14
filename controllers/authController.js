const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/Users');

exports.authenticateUser = async (req, res) => {

    // check errors
    let errores = validationResult(req);
    
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }
    
    const { email, password } =  req.body;

    try {

        let user = await User.findOne({ email });
        if(!user){
            res.status(400).json({ msg: 'Usuario No Existe'})
        }

        const passCorrecto = await bcryptjs.compare(password, user.password);
        if(!passCorrecto) {
            return res.status(400).json({ msg: 'Contraseña invalida'});
        }

        // generamos el JWT para el ingreso del usuario a la plataforma
        //crear y firmar el JWT PARA LA CONEXION SEGURA  con esto creamos el JWT
        const payload = {
            user: {
                id: user.id
           }

        };
        // CON ESTO FIRMAMOS EL jwt
        jwt.sign(payload, process.env.SECRET_WORD, {
            expiresIn: 3600, // 1h para la vida del token
            }, (error, token) => {  
                if(error) throw error;

            // mensaje de confirmacion 
            res.json({ token: token });
        });

    } catch (error) {
        console.log(error);
    }

    
}

//obtiene que usuario esta autenticado
exports.authenticatedUser = async (req, res) => {
    try {
        const usuario = await Usuario.findById( req.usuario.id).select('-password'); // con esto le decimos que el password
        if(usuario){                                                                 // no lo queremos, pero devuelve los demas campos
            res.json({usuario});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({'msg': 'Hubo un error de autenticacion'})
    }
}