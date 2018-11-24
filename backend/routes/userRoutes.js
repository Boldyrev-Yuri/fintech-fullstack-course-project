import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import User from '../models/userModel';

const router = express.Router();

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(foundUser => {
    if (foundUser) {
      return res.status(400).json({
        email: 'Email уже зарегистрирован'
      });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error('Возникла ошибка', err);
      } else {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.error('Возникла ошибка', err);
          } else {
            newUser.password = hash;
            newUser.save().then(user => {
              res.json(user)
            }); 
          }
        });
      }
    });
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  const { email, password } = req.body;

  if (!isValid) {
    return res.status(400).json(errors);
  }
  console.log(errors, isValid, email, password);

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'Такого пользователя не существует';
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(payload, 'secret', {
          expiresIn: 3600
        }, (err, token) => {
            if (err) {
              console.error('Возникла ошибка', err);
            } else {
              res.json({
                success: true,
                token: token
              });
            }
        });
      } else {
        errors.password = 'Неверный пароль';
        return res.status(400).json(errors);
      }
    });
  });
});

// Для будущего профиля
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

export default router;
