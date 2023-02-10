const Categories = require("../models/categories");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const getCategories = catchAsyncErrors(async (req, res) => {
  const data = await Categories.find({});
  res.status(200).json({ data: JSON.stringify(data) });
});

const addCategory = catchAsyncErrors(async (req, res) => {
  const category = req.body;
  const newCategory = await Categories.create(category);

  res.status(201).json({ success: true, data: "Category added successfully" });
});

const deleteCategory = catchAsyncErrors(async (req, res) => {
  const category = req.body;
  const deleteCategory = await Categories.deleteOne({ _id: category._id });
  // console.log(deleteCategory);
  if (deleteCategory.deletedCount > 0) {
    res
      .status(200)
      .json({ success: true, data: "Category deleted successfully" });
  } else {
    res.status(400).json({ success: false, data: "Invalid category id" });
  }
});

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
};
