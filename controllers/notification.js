const Notification = require("../models/notification");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const getAllNotifications = catchAsyncErrors(async (req, res) => {
  const { id: userID } = req.params;
  const notifications = await Notification.find({ userID: userID }).sort(
    "-createdAt"
  );
  if (!notifications) {
    return next(new ErrorHandler("Post with given ID not found", 404));
  }
  res
    .status(200)
    .json({ count: notifications.length, data: notifications, success: true });
});

module.exports = {
  getAllNotifications,
};
