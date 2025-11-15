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
const { requestLogger, errorLogger } = require('./middleware/logger');
const cors = require('cors');



const allowedOrigins = [
  'https://jacopeth.twilightparadox.com',
  'https://www.jacopeth.twilightparadox.com',
  'https://api.jacopeth.twilightparadox.com',
  'http://localhost:3000'
];

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
});

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // permite tools e insomnia
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(204);
});
app.use(express.json());
//  app.use((req, res, next) => {
//    req.user = {
//      _id: '6914bacba15267df46e50630',
//    };

//    next();
//  });
app.use(requestLogger);
app.post('/signin', validateInput, login);
app.post('/signup', validateInput, createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});
app.use(errorLogger);
app.use(errors());
app.use(err);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}....`);
});


