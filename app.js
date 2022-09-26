if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const { db } = require('./db');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const app = express();
app.disable('x-powered-by');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
const sessionStoreOpts = {
  mongoUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/camp',
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 3600
};
const sessionOpts = {
  store: MongoStore.create(sessionStoreOpts),
  path: '/',
  httpOnly: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  maxAge: 100 * 60 * 60
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionOpts.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

db.init();

app.use(routes);

//* Error Routes
app.use((err, req, res, next) => {
  console.log('Caught!!', err);
  res.render('error', { err, currentUser: req.user });
  next();
});

const server = app.listen(3000, () => {
  console.log('Serving on 3000');
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  db.close();
  server.close((err) => {
    console.log('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});
