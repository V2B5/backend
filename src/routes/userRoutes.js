const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/decodeJWT');

router.get('/', userController.UserGet);
router.get('/', auth, userController.UserGet);
router.get('/completo', auth, userController.UserGetFull);
router.get('/todos', userController.UserGetAll);
router.get('/:id', userController.UserByID);
router.post('/', userController.UserCreate);
router.put('/:id', userController.UserUpdate);
router.delete('/:id', userController.UserDelete);
router.post('/associar-posto', auth, userController.associarPosto);

module.exports = router;