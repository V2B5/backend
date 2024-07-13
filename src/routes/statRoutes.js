const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');
const auth = require('../middlewares/decodeJWT');

router.get('/eventos/:areaId', auth, statController.EventsPerAreaPost);
router.get('/estabelecimentos/:areaId', auth, statController.EstablishmentsPerAreaPost);
router.get('/eventos', auth, statController.EventsPerAreaCounter);
router.get('/estabelecimentos', auth, statController.EstablishmentsPerAreaCounter);
router.get('/mais-avaliados', statController.MostReviews);


module.exports = router;