const express = require('express');
const router = express.Router();
const establishmentController = require('../controllers/establishmentController');
const { uploadEstablishments } = require('../config/multer');
const auth = require('../middlewares/decodeJWT');

router.get('/', establishmentController.EstablishmentList);
router.get('/', auth, establishmentController.EstablishmentList);
router.get('/validar', establishmentController.EstabelecimentosPorValidar);
router.get('/validar', auth, establishmentController.EstabelecimentosPorValidar);
router.post('/', uploadEstablishments.single('foto'), establishmentController.EstablishmentCreate);
//router.post('/', auth, uploadEstablishments.single('foto'), establishmentController.EstablishmentCreate);
router.put('/:id', uploadEstablishments.single('foto'), establishmentController.EstablishmentEdit);
router.get('/:id', establishmentController.EstablishmentGet);
router.delete('/:id', establishmentController.EstablishmentDelete);


module.exports = router;