const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/decodeJWT');

router.get('/estabelecimentos/:id', reviewController.EstablishmentReviewsList)
router.post('/estabelecimentos/criar/:id', reviewController.EstablishmentReviewsCreate)
router.put('/estabelecimentos/:id', reviewController.EstablishmentReviewsEdit)
router.delete('/estabelecimentos/:id', reviewController.EstablishmentReviewsDelete)
router.post('/:id/upvote', auth, reviewController.Like)
router.post('/:id/downvote', auth, reviewController.Dislike)

router.get('/eventos/:id', reviewController.EventReviewsList)
router.post('/eventos/criar/:id', reviewController.EventReviewsCreate)
router.put('/eventos/:id', reviewController.EventReviewsEdit)
router.delete('/eventos/:id', reviewController.EventReviewsDelete)

router.get('/utilizador/:idUtilizador', reviewController.UserReviewsList);

router.get('/validar/eventos', auth, reviewController.AvaliacaoEventoPorValidar);
router.get('/validar/estabelecimentos', auth, reviewController.AvaliacaoEstabelecimentoPorValidar);

router.post('/eventos/responder/:idAvaliacao', auth, reviewController.responderAvaliacaoEvento)
router.get('/eventos/respostas/:idAvaliacao', auth, reviewController.getFilhosEvento)

router.post('/estabelecimentos/responder/:idAvaliacao', auth, reviewController.responderAvaliacaoEstabelecimento)
router.get('/estabelecimentos/respostas/:idAvaliacao', auth, reviewController.getFilhosEstabelecimento)

module.exports = router;