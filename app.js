var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');
var flash = require('express-flash');
var cors = require('cors');
var session = require('express-session');

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'leonardocuraca',
  api_key: '611241859463494',
  api_secret: 'uNK2Jjfg1dtDtWKoNR8iXbIgozE'
});

const cookieParser = require('cookie-parser');
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require('express');
const admin = require("firebase-admin");

var fileupload = require('express-fileupload');

const csrfMiddleware = csrf({ cookie: true });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var serviceAccount = require("./docker-integration-firebase-adminsdk-ltof1-c58fa0cde4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://docker-integration.firebaseio.com"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(fileupload({
  useTempFiles: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

module.exports = app;
