const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;


async function getUsersList(req, res) {
  try {
    const userList = await User.find({}).orFail();
    return res.send(userList);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Datos invalidos' });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    return res.status(500).send({ message: err.message });
  }
}

async function getUsersById(req, res) {
  const { id } = req.params;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Datos invalidos' });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    return res.status(500).send({ message: err.message });
  }
}

async function createUser(req, res) {
  const { name, about, avatar, email, password } = req.body;
  console.log(req.body)
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, about, avatar, email, password: hashedPass });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Datos invalidos' });
    }
    if (err.code === 11000) {
    return res.status(409).send({ message: 'El correo electrónico ya está registrado' });
  }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no creado' });
    }
    return res.status(500).send({ message: err.message });
  }
}

async function updateUser(req, res) {
  const { name, about } = req.body;
  const id = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(id, { name, about }).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Datos invalidos' });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no actualizado' });
    }
    return res.status(500).send({ message: err.message });
  }
}

async function updateAvatar(req, res) {
  const { avatar } = req.body;
  const id = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(id, { avatar }, { runValidators: true }).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Datos invalidos' });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no actualizado' });
    }
    return res.status(500).send({ message: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
try {
const user = await User.findOne({ email }).select('+password');
 if(!user) {
  return res.status(404).send({ message: 'Usuario no existe'})
}
const matched = await bcrypt.compare(password, user.password);
if (!matched) {
  return res.status(401).send({ message: 'Credenciales incorrectas'})
}
const token = jwt.sign({_id: user._id },
   NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string',
      { expiresIn: '7d' });
return res.send({ token });
  } catch (error) {
 return res.status(401).send({message: error.message});
}

}

async function getCurrentUser(req, res) {
 try {
    const user = await User.findById(req.user._id).orFail();
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Datos inválidos' });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    return res.status(500).send({ message: err.message });
  }
}

module.exports = { getUsersList, getUsersById, createUser, updateUser, updateAvatar, login, getCurrentUser };