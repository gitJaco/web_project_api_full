const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30,
  },

  about: {
    type: String,
    default: 'Explorador',
    minlength: 2,
    maxlength: 30,
  },

   avatar: {
     type: String,
     default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
     validate: {
       validator(v) {
         return /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?%#\[\]@!$&'()*+,;=-]*)?(#)?$/.test(v);
       },
       message: (props) => `${props.value} no es un enlace válido para el avatar.`,
     },
   },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'El formato del correo electrónico no es válido',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({email})
  .then((user))
}

module.exports = mongoose.model('user', userSchema);