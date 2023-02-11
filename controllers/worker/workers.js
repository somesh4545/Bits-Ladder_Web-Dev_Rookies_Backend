const Workers = require("../../models/workers");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const workerRegistration = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const data = {
    name: body.name,
    phone_no: body.phone_no,
    password: body.password,
    phone_verified: body.phone_verified,
    aadhar_id: body.aadhar_id,
    aadhar_card_url: body.aadhar_card_url,
  };
  const newWorker = await Workers.create(data);

  res.status(200).json({
    success: true,
    data: newWorker,
    message: "Worker created successfully",
  });
});

const workerLogin = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const data = {
    phone_no: body.phone_no,
    password: body.password,
  };
  const newWorker = await Workers.findOne(data);
  if (!newWorker) {
    res.status(400).json({
      success: false,
      message: "Entered phone number or password is incorrect",
    });
  }

  res
    .status(200)
    .json({ success: true, data: newWorker, message: "Login successful" });
});

const updateWorker = catchAsyncErrors(async (req, res) => {
  const body = req.body;
  const { id: worker_id } = req.params;

  const updatedWorker = await Workers.findOneAndUpdate(
    { _id: worker_id },
    body,
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
    .json({
      success: true,
      data: updatedWorker,
      message: "Worker updated successfully",
    });
});

const getWorkerByID = catchAsyncErrors(async (req, res) => {
  const { id: worker_id } = req.params;
  const worker = await Workers.findOne({ _id: worker_id });
  // console.log(worker_id);
  if (!worker) {
    res.status(404).json({ error: 404, msg: "Worker not found" });
  }

  res.status(200).json({ data: worker });
});

module.exports = {
  workerRegistration,
  workerLogin,
  updateWorker,
  getWorkerByID,
};
