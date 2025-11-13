const jwt = require('jsonwebtoken')
 require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Se requiere autorizacion' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
   payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string');
  } catch (error) {
   return res.status(401).send({message: 'Authorization required'});
  }

  req.user = payload;

  next();
}