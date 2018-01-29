import express from 'express';
const passport = require('passport');

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'CryptoWatcher',
    message: 'not found'
  });
});

router.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home',
    message: 'Welcome to the homepage'
  });
});

export default router;
