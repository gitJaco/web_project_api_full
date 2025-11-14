const cardsRouter = require('express').Router();
const { getCardsList, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const { validateCreateCard } = require('../middleware/validateUrl')

cardsRouter.get('/cards', getCardsList);
cardsRouter.post('/cards', validateCreateCard, createCard);
cardsRouter.delete('/cards/:id', deleteCard);
cardsRouter.put('/cards/:id/likes', likeCard);
cardsRouter.delete('/cards/:id/likes', dislikeCard);

module.exports = cardsRouter;