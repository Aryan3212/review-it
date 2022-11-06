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
const ExpressMongoSanitize = require('express-mongo-sanitize');
const flash = require('connect-flash');
const helmet = require('helmet');
const app = express();
app.use(helmet());
const scriptSrcUrls = [
    'https://cdnjs.cloudflare.com',
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
    'https://kit.fontawesome.com'
];
const styleSrcUrls = [
    'https://unpkg.com',
    'https://cdn.jsdelivr.net',
    'https://cdnjs.cloudflare.com'
];
const connectSrcUrls = [
    'https://api.maptiler.com',
    'https://ka-f.fontawesome.com/'
];
const fontSrcUrls = ['https://ka-f.fontawesome.com/'];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            manifestSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            childSrc: ['blob:'],
            objectSrc: [],
            imgSrc: [
                "'self'",
                'blob:',
                'data:',
                'https://res.cloudinary.com/dwz8ueclf/'
            ],
            scriptSrcAttr: ["'unsafe-inline'", "'self'"],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })
);

app.disable('x-powered-by');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(ExpressMongoSanitize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
const sessionStoreOpts = {
    mongoUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/review-it',
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600
};
const sessionOpts = {
    name: process.env.session_name,
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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

db.init();

app.use(routes);

//* Error Routes
app.use((err, req, res, next) => {
    console.log(err);
    res.render('error', { err, currentUser: req.user });
    next();
});

const server = app.listen(process.env.port || 3000, () => {
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
