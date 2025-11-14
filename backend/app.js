const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middleware/auth');
const err = require('./middleware/error');
const { validateInput } = require('./middleware/validateInput');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
var cors = require('cors');


const corsOptions = {
  origin: 'https://api.jacopeth.twilightparadox.com',
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
//  app.use((req, res, next) => {
//    req.user = {
//      _id: '6914bacba15267df46e50630',
//    };

//    next();
//  });
app(requestLogger);
app.post('/signin', validateInput, login);
app.post('/signup', validateInput, createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});
app(errorLogger);
app.use(errors());
app.use(err);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}....`);
});


