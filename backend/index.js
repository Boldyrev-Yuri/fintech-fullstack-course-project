import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import SourceMapSupport from 'source-map-support';
// импортируем пути
import connectString from './mongodbConnect';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import passportUser from './passportUser';

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
// require('./passportUser')(passport);
passportUser(passport);

// allow-cors
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

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

// app.use('/tasks', taskRoutes);
// app.use('/account', userRoutes);

// set the port
const PORT = process.env.PORT || 3001;

// add Source Map Support
SourceMapSupport.install();

// catch 404
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Страница не найдена! (404)</h2>');
});

// start the server
app.listen(PORT, () => {
  console.log(`Сервер использует порт ${PORT}`);
});
