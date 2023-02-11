const express = require("express");
const {
  registerClient,
  loginClient,
  createPost,
  getAllPosts,
  getAllClientPosts,
  getPostByID,
  addResponse,
  updateResponse,
} = require("../controllers/clientController");
const router = express.Router();

router.route("/new").post(registerClient);

router.route("/login").post(loginClient);

// issue post routes
router.route("/post").get(getAllPosts).post(createPost);
router.route("/post/:id").get(getPostByID);

// route for getting all the posts by particular client
router.route("/:id/posts").get(getAllClientPosts);

router.route("/post/:id/response").post(addResponse);
router.route("/post/:id/response/:responseID").patch(updateResponse);

module.exports = router;
