const usersRouter = require('express').Router();
const { getUsersList, getUsersById, createUser, updateUser, updateAvatar, getCurrentUser } = require('../controllers/users');
const { validateUserAvatar } = require('../middleware/validateUrl')

usersRouter.get('/users', getUsersList);
// usersRouter.get('/users/:id', getUsersById);
// usersRouter.post('/users', createUser);
usersRouter.get('/users/me', getUsersById);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = usersRouter;