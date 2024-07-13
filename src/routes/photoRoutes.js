const express = require('express');
const router = express.Router();
const establishmentController = require('../controllers/establishmentController');
const eventController = require('../controllers/eventController');
const userController = require('../controllers/userController');
const { uploadEstablishments, uploadEvents, uploadUsers} = require('../config/multer');


router.get('/estabelecimentos/:id', establishmentController.EstablishmentPhotoGet);
router.get('/eventos/:id', eventController.EventPhotoGet);
router.post('/estabelecimentos/:id', uploadEstablishments.single('foto'), establishmentController.EstablishmentPhotoUpdate);
router.delete('/estabelecimentos/:id', establishmentController.EstablishmentPhotoDelete);
router.post('/eventos/:id', uploadEvents.single('foto'), eventController.EventPhotoUpload);
router.delete('/eventos/:id', eventController.EventPhotoDelete);
router.get('/utilizador/:id', userController.UserPhotoGet);
router.post('/utilizador/:id', uploadUsers.single('foto'), userController.UserPhotoUpload);
router.delete('/utilizador/:id', userController.UserPhotoDelete);



module.exports = router;