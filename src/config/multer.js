const multer = require('multer');
const path = require('path');


const storageEvents = multer.diskStorage({
    destination: './uploads/events',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});


const storageEstablishments = multer.diskStorage({
    destination: './uploads/establishments',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});


const storageUsers = multer.diskStorage({
    destination: './uploads/users',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});

const uploadEvents = multer({ storage: storageEvents });
const uploadEstablishments = multer({ storage: storageEstablishments });
const uploadUsers = multer({ storage: storageUsers });

module.exports = {
    uploadEvents,
    uploadEstablishments,
    uploadUsers
};