const express = require("express");
const { getAllNotifications } = require("../controllers/notification");

const router = express.Router();

// get all the notifications of particular person based on user id
router.route("/:id").get(getAllNotifications);

module.exports = router;
