const express = require('express');
const { registerClient, loginClient, createPost, updatePost, getAllPosts, getClientPost } = require('../controllers/clientController');
const router = express.Router()

router.route("/new").post(registerClient);
router.route("/login").post(loginClient)



//issue post routes
router.route("/post").get(getAllPosts).post(createPost)
router.route("/post/:id").patch(updatePost).get(getClientPost)

module.exports = router
