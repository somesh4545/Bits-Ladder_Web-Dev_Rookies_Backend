const express = require("express");
const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../controllers/categories");

const router = express.Router();

// use this route get all the categories
router.route("/").get(getCategories);

// route to add category,
router.route("/").post(addCategory);

// route to delete category
router.route("/").delete(deleteCategory);

module.exports = router;
