const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/decodeJWT');

router.get('/', notificationController.NotificationGet);
router.post('/', notificationController.NotificationCreate);
router.delete('/', notificationController.NotificationDelete);
router.get('/', auth, notificationController.NotificationGet);
router.post('/', auth, notificationController.NotificationCreate);
router.delete('/', auth, notificationController.NotificationDelete);
router.get('/contador', auth, notificationController.NotificationCounter)
router.put('/lido', auth, notificationController.MarkAsRead);

module.exports = router;