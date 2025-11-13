const cardsRouter = require('express').Router();
const { getCardsList, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

cardsRouter.get('/cards', getCardsList);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:id', deleteCard);
cardsRouter.put('/cards/:id/likes', likeCard);
cardsRouter.delete('/cards/:id/likes', dislikeCard);

module.exports = cardsRouter;