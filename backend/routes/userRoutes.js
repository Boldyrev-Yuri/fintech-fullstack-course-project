import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import User from '../models/userModel';
import mailgunApi from '../mailgunApi';

const router = express.Router();
const mailgun = require('mailgun-js')({ apiKey: mailgunApi.apiKey, domain: mailgunApi.domain });

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
        bcrypt.hash(newUser.password, salt, (errHash, hash) => {
          if (err) {
            console.error('Возникла ошибка', errHash);
          } else {
            newUser.password = hash;
            newUser.save().then(user => {
              const data = {
                from: mailgunApi.from,
                to: user.email,
                subject: `Hello, ${user.name}!`,
                html: '<div style="text-align: center; font-size: 20px; font-family: Segoe UI, Roboto;">' +
                'Вы только что зарегистрировались на нашем сайте. '+
                '<a href="http://localhost:3001/api/users/validate/' +
                user.email +
                '">Нажмите здесь, чтобы подтвердить ваш адрес электронной почты</a><div>'
              };
              
              mailgun.messages().send(data, (error, body) => {
                console.log('email = ', user.email, 'body = ', body, 'error = ', error);
              });
              return res.json(user)
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

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'Такого пользователя не существует';
      return res.status(404).json(errors);
    }
    if (!user.validated) {
      errors.validate = 'Ваша учетная запись не подтверждена. Перейдите по ссылке в письме';
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
              return res.json({
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

router.get('/validate/:email', (req, res) => {
  const { email } = req.params;

  User.findOneAndUpdate({ email }, { validated: true })
    .then(foundUser => {
      if (foundUser.validated) {
        const html = `
        <div 
          style="text-align: center; font-size: 20px; font-family: Segoe UI, Roboto;"
        >
          Email ${email} уже подтвержден<br />
          <a href="http://localhost:3000/">Главная страница<a/>
        </div>`;

        res.send(html);
      }
      const html = `
        <div 
          style="text-align: center; font-size: 20px; font-family: Segoe UI, Roboto;"
        >
          Спасибо, email ${email} был подтвержден! <br />
          <a href="http://localhost:3000/login">Войти на сайт<a/>
        </div>`;

      res.send(html);
    })
    .catch(err => {
      console.log(err);
      const html = `
        <div 
          style="text-align: center; font-size: 20px; font-family: Segoe UI, Roboto;"
        >
          Сожалеем, но такого email (${email}) нет в базе данных :( <br />
          <a href="http://localhost:3000/register">Зарегистрироваться<a/>
        </div>`;

      res.send(html);
    });
});

export default router;
