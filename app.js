const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const { db } = require('./db');
const routes = require('./routes');

const app = express();

app.disable('x-powered-by');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

db.init();

app.use(routes);

//* Error Routes
app.use((err, req, res, next) => {
  console.log('Caught!!', err);
  res.render('error');
  next();
});

const server = app.listen(3000, () => {
  console.log('Serving on 3000');
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  db.close();
  server.close(err => {
    console.log('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});
