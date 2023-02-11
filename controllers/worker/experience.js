const Workers = require("../../models/workers");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const addWorkerExperience = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const { id: worker_id } = req.params;

  const updatedWorker = await Workers.findOneAndUpdate(
    { _id: worker_id },
    { $push: { experiences: body } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedWorker) {
    res.status(404).json({ success: false, message: "Worker ID invalid" });
  }
  res
    .status(200)
    .json({ success: true, message: "Worker experience added successfully" });
});

const getWorkerExperiences = catchAsyncErrors(async (req, res) => {
  const { id: worker_id } = req.params;

  const experiences = await Workers.findOne({ _id: worker_id }).select(
    "_id experiences"
  );
  if (!experiences) {
    res.status(404).json({ success: false, message: "Worker ID invalid" });
  }
  res.status(200).json({
    success: true,
    count: experiences.experiences.length,
    data: experiences.experiences,
  });
});

const removeWorkerExperience = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const { id: worker_id } = req.params;

  const updatedWorker = await Workers.findOneAndUpdate(
    { _id: worker_id },
    { $pull: { experiences: { _id: body.experience_id } } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedWorker) {
    res.status(404).json({ success: false, message: "Worker ID invalid" });
  }
  res.status(200).json({ success: true, message: "Experience removed" });
});

module.exports = {
  addWorkerExperience,
  getWorkerExperiences,
  removeWorkerExperience,
};
