const express = require('express');
const { registerClient, loginClient, createPost } = require('../controllers/clientController');
const router = express.Router()

router.route("/new").post(registerClient);
router.route("/login").post(loginClient)


//issue post routes
router.route("/post").post(createPost)

module.exports = router
