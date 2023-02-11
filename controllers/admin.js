const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Client = require("../models/client");
const Post = require("../models/post");
const Pairing = require("../models/pairing");
const Workers = require("../models/workers");
const workers = require("../models/workers");

const getAllWorkers = catchAsyncErrors(async (req, res, next) => {
  const { verified, blacklist } = req.query;
  var queryObject = {};
  if (verified) {
    queryObject.verified = verified;
  }
  if (blacklist) {
    queryObject.blacklist = blacklist;
  }

  const workers = await Workers.find(queryObject);

  if (!workers) {
    return next(new ErrorHandler("Error while fetching workers", 400));
  }
  res.status(200).json({ success: true, count: workers.length, data: workers });
});

const getAllClients = catchAsyncErrors(async (req, res, next) => {
  const { isBlackListed } = req.query;
  var queryObject = {};
  if (isBlackListed) {
    queryObject.isBlackListed = isBlackListed;
  }

  const clients = await Client.find(queryObject);
  if (!clients) {
    return next(new ErrorHandler("Error while fetching clients", 400));
  }
  res.status(200).json({ success: true, count: clients.length, data: clients });
});

const getStats = catchAsyncErrors(async (req, res, next) => {
  const clientCount = await Client.countDocuments({});
  const workercount = await Workers.countDocuments({});
  const pairCount = await Pairing.countDocuments({});

  res.status(200).json({
    success: true,
    totalClients: clientCount,
    totalWorkers: workercount,
    totalPairs: pairCount,
  });
});

const blackListClient = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { isBlackListed } = await Client.findById(id);
  const blacklistClient = await Client.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        isBlackListed: isBlackListed ? false : true,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!blacklistClient) {
    return next(
      new ErrorHandler("Cannot find client with given ID to blacklist")
    );
  }
  res.status(200).json({
    success: true,
    data: blacklistClient,
  });
});

const blackListWorker = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { blacklist } = await workers.findById(id);
  const blacklistWorker = await workers.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        blacklist: blacklist ? false : true,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!blacklistWorker) {
    return next(
      new ErrorHandler("Cannot find worker with given ID to blacklist")
    );
  }
  res.status(200).json({
    success: true,
    data: blacklistWorker,
  });
});

const verifyWorker = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const verify = await workers.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        verified: true,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!verify) {
    return next(
      new ErrorHandler("Cannot find worker with given ID to blacklist")
    );
  }
  res.status(200).json({
    success: true,
    data: verify,
  });
});

const getAllPairs = catchAsyncErrors(async (req, res, next) => {
  const pairs = await Pairing.find()
    .populate("worker", "_id name phone_no")
    .populate("owner", "_id name phone")
    .populate("post")
    .sort("createdAt");

  res.status(200).json({
    success: true,
    data: pairs,
  });
});

module.exports = {
  getAllWorkers,
  getAllClients,
  getStats,
  blackListClient,
  blackListWorker,
  verifyWorker,
  getAllPairs,
};
