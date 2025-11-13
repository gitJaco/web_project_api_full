const Card = require('../models/cards');

async function getCardsList(req, res, next) {
  try {
    const cardList = await Card.find({}).orFail();
    return res.send(cardList);
  } catch (error) {
    // if (err.name === 'ValidationError') {
    //   return res.status(400).send({ message: 'Datos invalidos' });
    // }
    // if (err.name === 'DocumentNotFoundError') {
    //   return res.status(404).send({ message: 'tarjeta no encontrada' });
    // }
    // return res.status(500).send({ message: err.message });
    next(error);
  }
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => {
      // if (err.name === 'ValidationError') {
      //   return res.status(400).send({ message: 'Datos invalidos' });
      // }
      // if (err.name === 'DocumentNotFoundError') {
      //   return res.status(404).send({ message: 'tarjeta no creada' });
      // }
      // return res.status(500).send({ message: err.message });
      next(error);
    });
}

async function deleteCard(req, res, next) {
  const { id } = req.params;
  try {
    const cardToDelete = await Card.findByIdAndDelete(id).orFail();
    return res.send(cardToDelete);
  } catch (error) {
    // if (error.name === 'ValidationError') {
    //   return res.status(400).send({ message: 'Datos invalidos' });
    // }
    // if (error.name === 'DocumentNotFoundError') {
    //   return res.status(404).send({ message: 'tarjeta no borrada' });
    // }
    // return res.status(500).send({ message: error.message });
    next(error);
  }
}

const likeCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  );
  return res.send(card);
};

const dislikeCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  );
  return res.send(card);
};

module.exports = { getCardsList, createCard, deleteCard, likeCard, dislikeCard };