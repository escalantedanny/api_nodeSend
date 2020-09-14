const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const Links    = require('../models/Links');
const shortid = require('shortid');


exports.createLinks = async (req,res, next) => {

    // check errors
    let errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    const { name, name_origin, password } = req.body;
    const link = new Links();
    link.url = shortid.generate();
    link.name = name;
    link.name_origin = name_origin;
    link.password = password;

    if(req.user.user){

        const { password, downloads } = req.body;
        if(downloads){
            link.downloads = downloads;
        }
        if(password){
            const salt = await bcryptjs.genSalt(10);
            link.password = await bcryptjs.hash(password, salt);
        }
        link.author = req.user.user.id;
    }

    try {

        await link.save();
        res.json({ msg: link.url});
        next();
        
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

exports.getLinks = async (req, res, next) => {

    const { url } = req.params;
    const link = await Links.findOne({url: url})
    if(!link){
        res.status(404).json({msg: 'Enlace no existe'})
        return next();
    }

    res.json({ file: link.name})

    const { downloads, name } = link;
    if(downloads === 1){

        //rsend req in other controller
        req.file = name;
        //delete intro database Mongo
        await Links.findOneAndRemove(req.params.url);
        // we are going to delete the file in the following controller
        next();
    } else {
        link.downloads--;
        await link.save();
    }

    
}
