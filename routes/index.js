import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'CryptoWatcher',
    message: 'not found'
  });
});

export default router;
