const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middleware/auth');
const err = require('./middleware/error');

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
});

app.use(express.json());
//  app.use((req, res, next) => {
//    req.user = {
//      _id: '6914bacba15267df46e50630',
//    };

//    next();
//  });
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});
app.use(err)

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}....`);
});


