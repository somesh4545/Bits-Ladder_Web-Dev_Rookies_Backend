const Workers = require("../../models/workers");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const updateWorkerRating = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const { id: worker_id } = req.params;

  const updatedWorker = await Workers.findOneAndUpdate(
    { _id: worker_id },
    {
      $inc: { "rating.total": body.rating, "rating.count": 1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedWorker) {
    res.status(404).json({ success: false, message: "Worker ID invalid" });
  }
  res.status(200).json({ success: true, message: "Rating updated" });
});

module.exports = {
  updateWorkerRating,
};
