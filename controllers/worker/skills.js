const Workers = require("../../models/workers");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const updateWorkerSkills = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const { id: worker_id } = req.params;

  const updatedWorker = await Workers.findOneAndUpdate(
    { _id: worker_id },
    {
      $set: { skills: body.skills },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedWorker) {
    res.status(404).json({ success: false, message: "Worker ID invalid" });
  }
  res.status(200).json({ success: true, message: "Skills updated" });
});

module.exports = {
  updateWorkerSkills,
};
