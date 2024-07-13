const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

router.get('/', areaController.AreaList);
router.get('/:areaId', areaController.SubareaList);

module.exports = router;