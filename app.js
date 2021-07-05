const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const routes = require('./routes');
const helmet = require('helmet');

// Authentication packages
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const app = express();
config.connectDB().then();
config.passportLocal();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/full-layout');
app.set('layout extractScripts', true); // for specific page script

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets/', express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(helmet());

// Authentication related middleware.
app.use(flash());
app.use(
  session({
    secret: 'local-library-session-secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 7 * 24 * 60 * 60, // 7 days. 14 Default.
    }),
    // cookie: { secure: true }
  })
);
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Pass isAuthenticated and current_user to all views.
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  // Delete salt and hash fields from req.user object before passing it.
  const safeUser = req.user;
  if (safeUser) {
    delete safeUser._doc.salt;
    delete safeUser._doc.hash;
  }
  res.locals.user = safeUser;
  next();
});

// Route app
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
