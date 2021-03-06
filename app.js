import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import passport from 'passport';
require('dotenv').config();
// import favicon from 'serve-favicon';

import index from './routes/index';
//import signup from './routes/signup';

const GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/home"
},
function(token, tokenSecret, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
}
))


const app = express();
const debug = Debug('crypto-martket-watcher:app');
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.get('/auth/google',
passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
  res.redirect('/home');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.route('/signup')
.get(function(req, res){
    if(typeof req.session.isLoggedIn !== 'undefined' && req.session.isLoggedIn){
        res.redirect('/index');
    }
    res.render('pages/signup', {errors: [''], message: ''});
})
.post(function(req, res){

    const fullName = req.body.fullname;
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const retypePassword = req.body.confirmpassword;

    userModel.signUp(fullName, userName, email, password, retypePassword, function(result){
        console.log(result);
        if(result.status == 'success'){
            res.redirect('/');
        }else{
            res.render('pages/signup', {errors: result.data, message: result.message});
        }

    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  +
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;
