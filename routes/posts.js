const express = require('express');
const { getAllPosts } = require('../controllers/clientController');
const router = express.Router()

router.route('/').get(getAllPosts)
module.exports = router
