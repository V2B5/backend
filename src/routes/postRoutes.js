const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.PostList);
router.get('/:postoId', postController.PostGet);

module.exports = router;