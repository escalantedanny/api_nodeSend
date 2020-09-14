const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

module.exports = (req, res, next ) => {

    const token = req.header('x-auth-token');
    if(!token)
        return res.status(401).json({ msg: 'permiso no valido'});

        try {
            const user = jwt.verify(token, process.env.SECRET_WORD );
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            console.log('JWT no valido');
        }

    return next();
}