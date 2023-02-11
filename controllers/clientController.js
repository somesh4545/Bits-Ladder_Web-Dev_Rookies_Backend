const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Client = require("../models/client");
const Post = require("../models/post");
const Pairing = require("../models/pairing");
const { default: mongoose } = require("mongoose");

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
  res.status(201).json({ message: "user created successfully" });
});

const loginClient = catchAsyncErrors(async (req, res, next) => {
  const { name, password } = req.body;

  // checking if user has given password and email both

  if (!name || !password) {
    return next(new ErrorHandler("Please Enter name & Password", 400));
  }

  const client = await Client.findOne({ name }).select("+password");

  if (!client) {
    return next(new ErrorHandler("Invalid name or password", 401));
  }

  const pswd = await client.password;

  if (pswd !== password) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  res.status(200).json({ message: "client logged in succefully" });
});

const createPost = catchAsyncErrors(async (req, res, next) => {
  const { title, description, estimated_budget, owner, location } = req.body;
  if (!location) {
    return next(new ErrorHandler("Location property is required", 400));
  }
  const post = await Post.create({
    title,
    description,
    estimated_budget,
    owner,
    location,
  });
  if (!post) {
    return next(new ErrorHandler("Error while creating post", 500));
  }
  res.status(201).json({ success: true, message: "Post created succesfully" });
});

const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({});
  res
    .status(200)
    .json({ success: true, data: JSON.stringify(posts), count: posts.length });
});

const getAllClientPosts = catchAsyncErrors(async (req, res, next) => {
  const { id: owner_id } = req.params;
  const own_id = mongoose.Types.ObjectId(owner_id.trim());
  const post = await Post.find({ owner: own_id });
  if (!post) {
    return next(new ErrorHandler("Post with given client ID not found", 404));
  }
  res
    .status(200)
    .json({ success: true, count: post.length, data: JSON.stringify(post) });
});

const getPostByID = catchAsyncErrors(async (req, res, next) => {
  const { id: postID } = req.params;
  const post = await Post.findOne({ _id: postID });
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
        "responses._id": responseID,
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

    await Pairing.create({
      owner: ownerID,
      worker: workerID,
      post: postID,
    });
    if (!post) {
      return next(ErrorHandler("Invalid id for post", 400));
    }

    res.status(200).json({ success: true, message: "Winner has been added" });
  } else if (isOpen == true && responseStatus == "Rejected") {
    const post = await Post.findOneAndUpdate(
      {
        _id: postID,
        "responses._id": responseID,
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
      return next(ErrorHandler("Invalid id for post", 400));
    }

    res.status(200).json({ success: true, message: "Updated the post" });
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

// isOpen false -> winner field will be filled -> pairing schema will create object

// responses
