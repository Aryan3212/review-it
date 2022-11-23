import express, { Application, NextFunction, Request, Response } from "express";

require('dotenv').config();

import https from 'https';
import fs from 'fs';
import path from 'path';
import methodOverride from 'method-override';
import { db } from './db';
import routes from './routes';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import flash from 'connect-flash';
import helmet from 'helmet';
import { Server } from "http";

const app:Application = express();
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
if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}
app.use(methodOverride('_method'));
const sessionStoreOpts = {
    mongoUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/review-it',
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600
};
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24);
const sessionOpts = {
    name: process.env.SESSION_NAME,
    store: MongoStore.create(sessionStoreOpts),
    path: '/',
    httpOnly: true,
    cookie: {
        httpOnly: true,
        expires: expiryDate
    },
    secret: process.env.SESSION_SECRET || 'development',
    resave: false,
    saveUninitialized: true,
    maxAge: 100 * 60 * 60
};
if (process.env.NODE_ENV === 'production') {
    console.log('Secured!');
    app.set('trust proxy', 1); // trust first proxy
    sessionOpts.cookie = {
        httpOnly: true,
        expires: expiryDate,
    };
}
app.use(session(sessionOpts));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

db.init();

app.use(routes);

//* Error Routes
app.use((err: Error, req: Request , res: Response, next: NextFunction) => {
    console.log(err);
    res.render('error', { err, currentUser: req.user });
    next();
});
let server:https.Server | Server;
if (process.env.HTTPS !== 'unset') {
    server = https
        .createServer(
            {
                key: fs.readFileSync('key.pem'),
                cert: fs.readFileSync('cert.pem')
            },
            app
        )
        .listen(process.env.PORT || 443);
} else {
    server = app.listen(process.env.PORT || 3000, () => {
        console.log('Serving on', process.env.PORT || 3000);
    });
}
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    db.close();
    server.close((err?: Error) => {
        console.log('Http server closed.');
        process.exit(err ? 1 : 0);
    });
});
