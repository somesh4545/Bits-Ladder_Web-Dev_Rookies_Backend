const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Client = require("../models/client");
const Post = require("../models/post");
const Pairing = require("../models/pairing");
const { default: mongoose } = require("mongoose");
const { sendNotification } = require("../utils/utils");

const registerClient = catchAsyncErrors(async (req, res, next) => {
  //client will register with only name, password and verified phone number
  const { name, phone, password } = req.body;

  // if(phone){
  //     return next(new ErrorHandler("Phone number already registered", 400));
  // }

  const client = await Client.create({
    name,
    phone,
    password,
  });
  if (!client) {
    res.status(400).json({ success: false, message: "User not created" });
  }
  res.status(201).json({
    success: true,
    data: client,
    message: "user created successfully",
  });
});

const loginClient = catchAsyncErrors(async (req, res, next) => {
  const body = req.body;
  const data = {
    phone: body.phone_no,
    password: body.password,
  };
  const loggedClient = await Client.findOne(data);
  if (!loggedClient) {
    res.status(400).json({
      success: false,
      message: "Entered phone number or password is incorrect",
    });
  }

  res
    .status(200)
    .json({ success: true, data: loggedClient, message: "Login successful" });
});

const createPost = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const post = await Post.create(req.body);
  if (!post) {
    return next(new ErrorHandler("Error while creating post", 500));
  }
  res.status(201).json({
    success: true,
    data: { postID: post._id },
    message: "Post created succesfully",
  });
});

const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({})
    .populate("category winner.worker")
    .populate("responses.worker", "_id name rating")
    .populate("owner", "_id name");
  res
    .status(200)
    .json({ success: true, data: JSON.stringify(posts), count: posts.length });
});

const getAllClientPosts = catchAsyncErrors(async (req, res, next) => {
  const { id: owner_id } = req.params;
  const own_id = mongoose.Types.ObjectId(owner_id.trim());
  const post = await Post.find({ owner: own_id })
    .populate("category winner.worker")
    .populate("responses.worker", "_id name rating");
  if (!post) {
    return next(new ErrorHandler("Post with given client ID not found", 404));
  }
  res
    .status(200)
    .json({ success: true, count: post.length, data: JSON.stringify(post) });
});

const getPostByID = catchAsyncErrors(async (req, res, next) => {
  const { id: postID } = req.params;
  const post = await Post.findOne({ _id: postID })
    .populate("category winner.worker")
    .populate("responses.worker", "_id name rating")
    .populate("owner", "_id name");
  if (!post) {
    return next(new ErrorHandler("Post with given ID not found", 404));
  }
  res.status(200).json({ data: JSON.stringify(post), success: true });
});

const updateResponse = catchAsyncErrors(async (req, res, next) => {
  // post will have winner and it will be closed
  const { id: postID, responseID: responseID } = req.params;

  const { isOpen, ownerID, workerID, quotation_amnt, responseStatus } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(postID))
    return res
      .status(404)
      .json({ success: false, message: `No post with id: ${postID}` });

  if (isOpen == false && responseStatus == "Accepted") {
    const post = await Post.findOneAndUpdate(
      {
        _id: postID,
        owner: ownerID,
        "responses._id": responseID,
        "responses.worker": workerID,
      },
      {
        $set: {
          winner: { worker: workerID, quotation_amnt: quotation_amnt },
          isOpen: isOpen,
          "responses.$.selected": responseStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      res.status(401).json({ success: false, message: "Invalid parameters" });
    } else {
      await Pairing.create({
        owner: ownerID,
        worker: workerID,
        post: postID,
      });
      await sendNotification(
        "Congrats your bid has been accepted",
        "Contact the owner for more details",
        "Worker",
        workerID,
        true
      );
      res.status(200).json({ success: true, message: "Winner has been added" });
    }
  } else if (isOpen == true && responseStatus == "Rejected") {
    const post = await Post.findOneAndUpdate(
      {
        _id: postID,
        owner: ownerID,
        "responses._id": responseID,
        "responses.worker": workerID,
      },
      {
        $set: {
          isOpen: isOpen,
          "responses.$.selected": responseStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      res.status(401).json({ success: false, message: "Invalid parameters" });
    } else {
      await sendNotification(
        "Your bid has been rejected",
        "Don't worry there are many other works",
        "Worker",
        workerID,
        true
      );

      res.status(200).json({ success: true, message: "Updated the post" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid parameters" });
  }
});

const addResponse = catchAsyncErrors(async (req, res, next) => {
  const { id: post_id } = req.params;
  const body = req.body;

  const updatedPost = await Post.findOneAndUpdate(
    { _id: post_id, isOpen: true },
    { $push: { responses: body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPost) {
    res.status(400).json({
      success: false,
      message: "Please try again after some time",
    });
  }
  await sendNotification(
    "New bid",
    `A new bid has been received in #${updatedPost._id} post`,
    "Client",
    updatedPost.owner,
    false
  );
  res.status(200).json({
    success: true,
    message: "Response added to the post successfully",
  });
});

module.exports = {
  registerClient,
  loginClient,
  createPost,
  getAllPosts,
  getAllClientPosts,
  getPostByID,
  updateResponse,
  addResponse,
};
