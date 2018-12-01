import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import moment from 'moment-timezone';

import connectString from './mongodbConnect';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import passportUser from './passportUser';
import Task from './models/taskModel';
import User from './models/userModel';
import mailgunApi from './mailgunApi';

const app = express();

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(
  connectString,
  { useCreateIndex: true, useNewUrlParser: true }
).then(
  () => { console.log('Подключение к БД установлено'); },
  err => { console.log(`Ошибка при подключении к БД: ${err}`); }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка соединения с MongoDB'));

app.use(passport.initialize());
passportUser(passport);

// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.end('Сервер работает');
});
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// set the port
const PORT = process.env.PORT || 3001;

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Страница не найдена! (404)</h2>');
});

// start the server
app.listen(PORT, () => {
  console.log(`Сервер использует порт ${PORT}`);
});

const interval = 10000;
const mailgun = require('mailgun-js')({ apiKey: mailgunApi.apiKey, domain: mailgunApi.domain });

moment.tz.setDefault(moment.tz.guess());

const checkNotify = setInterval(() => {
  let date = new Date();

  date = moment(date).tz(moment().tz()).format();
  const dateAdd = moment(date).add(30, 'm').toDate();

  // console.log('Current datetime: ', date);
  Task.find({ notify: true, notified: false })
    .where('deadline').gt(date).lt(dateAdd)
    .then(foundTasks => {
      foundTasks.forEach((task, i) => {
        User.findById(task.userId)
          .then(foundUser => {
            console.log('foundTask: ', task, 'foundUser: ', foundUser);
            const data = {
              from: mailgunApi.from,
              to: foundUser.email,
              subject: `Задача ${task.name} скоро закончится!`,
              html: '<div style="text-align: center; font-size: 20px; font-family: Segoe UI, Roboto;">' +
              `Здравствуйте, ${foundUser.name},\n` +
              `Информируем Вас о том, что в течение 30 минут необходимо выполнить Вашу задачу ${task.name}, чтобы успеть до дедлайна.\n` +
              'Если Вы ее уже сделали, не забудьте, пожалуйста, отметить ее также и на нашем сайте..\n' +
              'Если Вы знаете, что не успеете, то рекомендуем Вам отложить выполнение задачи, изменив ее дедлайн.\n' +
              'Спасибо, что пользуетесь нашими услугами!</div>'
            };
            
            mailgun.messages().send(data, (error, body) => {
              console.log('email: ', foundUser.email, 'body: ', body, 'error: ', error);
            });
            Task.findByIdAndUpdate(task._id, { notified: true }, { new: true })
              .then(newTask => {
                console.log('Modified and notified: ', newTask);
              })
              .catch(err => {
                console.log('Error: ', err);
              });
          });
      });
    })
    .catch(err => {
      console.log('Something went wrong. Error: ', err);
    });
}, interval);
