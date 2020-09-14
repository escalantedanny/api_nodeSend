const shortid = require('shortid');
// upload file with node
const multer = require('multer');
const fileSystem = require('fs')

exports.uploadFile = async (req,res, next) => {
    // default settings Multer 
    const settingsMulter = {
    
        limits : { fileSize : req.user ? 1024*1024*10: 1024*1024 },
        storage : fileStorage = multer.diskStorage({
            destination : (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                //const extention = file.mimetype.split('/')[1];
                const extention = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extention}`);
            },
            fileFilter: (req, file, cb) => {
                if(file.mimetype === 'application/pdf'){
                    //return if file is pdf
                    //return cb(null, true) 
                }
            }
        })
    }
    
    const upload = multer(settingsMulter).single('file_upload');
    
    upload( req, res, async(error) => {
        console.log(req.file)
        if(!error){
            res.json({file: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    })

}

exports.deleteFile = async ( req, res, next ) => {
    try {
        fileSystem.unlinkSync(__dirname+`/../uploads/${req.file}`);
        console.log('delete file');
    } catch (error) {
        console.log(error);
    }

}