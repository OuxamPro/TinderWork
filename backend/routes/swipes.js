const express = require('express');
const router = express.Router();
const { createSwipe, getSwipes } = require('../controllers/swipeController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
    .post(createSwipe)
    .get(getSwipes);

module.exports = router; 