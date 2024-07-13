const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { uploadEvents } = require('../config/multer');
const auth = require('../middlewares/decodeJWT');


router.get('/', eventController.EventList);
//router.get('/', auth, eventController.EventList);
router.get('/validar', auth, eventController.EventosPorValidar);
router.post('/', uploadEvents.single('foto'), eventController.EventCreate);
//router.post('/', auth, uploadEvents.single('foto'), eventController.EventCreate);
router.delete('/:id', eventController.EventDelete);
router.get('/:id', eventController.EventGet);
router.put('/:id', uploadEvents.single('foto'), eventController.EventEdit);

/*
router.get('/:id/inscricao', eventController.EventSubscriptionGet);
router.post('/inscrever/:id', auth, eventController.EventSubscribe);
router.delete('/desinscrever/:id', auth, eventController.EventUnsubscribe);
router.get('/inscricao/:id', auth, eventController.SubscriptionVerify);
*/


module.exports = router;